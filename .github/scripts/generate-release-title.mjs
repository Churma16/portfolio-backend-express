import { execSync } from "node:child_process";

const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const releaseModelName = process.env.RELEASE_TITLE_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

if (!openRouterApiKey) {
  console.error("[fail-closed] Missing OPENROUTER_API_KEY environment variable.");
  process.exit(1);
}

// 1. Collect conventional commits since the latest git tag
let rawCommitLines = [];
try {
  // Use cross-platform git tag resolution (avoid shell pipe grep/sort/tail)
  let latestOfficialTag = "";
  try {
    const allTagsOutput = execSync('git tag -l "v*" --sort=v:refname 2>/dev/null || true')
      .toString()
      .trim();
    if (allTagsOutput) {
      const semverRegex = /^v\d+\.\d+\.\d+$/;
      const officialTags = allTagsOutput
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => semverRegex.test(t));
      if (officialTags.length > 0) {
        latestOfficialTag = officialTags[officialTags.length - 1];
      }
    }
  } catch {
    latestOfficialTag = "";
  }

  const revisionTarget = latestOfficialTag ? `${latestOfficialTag}..HEAD` : "HEAD";
  const gitLogOutput = execSync(`git log ${revisionTarget} --pretty=format:"* %s"`)
    .toString()
    .trim();

  if (gitLogOutput) {
    rawCommitLines = gitLogOutput.split("\n").filter((line) => line.trim().length > 0);
  }
} catch (error) {
  console.error("[fail-closed] Failed to retrieve git commit history:", error.message);
  process.exit(1);
}

if (rawCommitLines.length === 0) {
  console.error("[fail-closed] No commits found between latest tag and HEAD.");
  process.exit(1);
}

// 2. Adaptive Filtering: If > 50 commits, prioritize high-impact types (feat, fix, perf, refactor, breaking)
// and filter out noise (chore, docs, test, ci, style) to keep the LLM context focused on core changes.
let selectedCommitLines = rawCommitLines;

if (rawCommitLines.length > 50) {
  const highImpactRegex = /^\*\s*(feat|fix|perf|refactor)(\(.*\))?!?:|BREAKING/i;
  const filteredHighImpactCommits = rawCommitLines.filter((line) => highImpactRegex.test(line));

  if (filteredHighImpactCommits.length > 0) {
    selectedCommitLines = filteredHighImpactCommits.slice(0, 50);
  } else {
    selectedCommitLines = rawCommitLines.slice(0, 50);
  }
}

const commitLogEntries = selectedCommitLines.join("\n");

// 3. Query LLM for concise release title synthesis
const synthesisPrompt = `You are an automated release coordinator. Below is the list of conventional commits included in this release:

${commitLogEntries}

Task: Write a single, concise release title (under 10 words) that summarizes the core user-facing and technical changes.
Rules:
- Output ONLY the title text.
- Do NOT include markdown formatting, backticks, emojis, prefixes like "Release Title:", or quotes.
- Focus on the main themes (e.g. Portfolio Cache Optimization and Contact Endpoint).`;

async function executeTitleSynthesis() {
  const abortController = new AbortController();
  const requestTimeoutId = setTimeout(() => abortController.abort(), 20000);

  try {
    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: releaseModelName,
        messages: [{ role: "user", content: synthesisPrompt }],
        temperature: 0.2,
      }),
      signal: abortController.signal,
    });

    clearTimeout(requestTimeoutId);

    if (!apiResponse.ok) {
      const errorBodyText = await apiResponse.text();
      console.error(`[fail-closed] OpenRouter API returned HTTP ${apiResponse.status}: ${errorBodyText}`);
      process.exit(1);
    }

    const responseJsonPayload = await apiResponse.json();
    let synthesizedTitle = responseJsonPayload?.choices?.[0]?.message?.content?.trim();

    if (!synthesizedTitle) {
      console.error("[fail-closed] OpenRouter API returned empty response content.");
      process.exit(1);
    }

    // Strip wrapping quotes, brackets, or markdown headers
    synthesizedTitle = synthesizedTitle.replace(/^["'`#\s]+|["'`\s]+$/g, "").replace(/[\r\n]+/g, " ");

    process.stdout.write(synthesizedTitle);
    process.exit(0);
  } catch (error) {
    clearTimeout(requestTimeoutId);
    console.error(`[fail-closed] Network or execution failure: ${error.message}`);
    process.exit(1);
  }
}

executeTitleSynthesis();
