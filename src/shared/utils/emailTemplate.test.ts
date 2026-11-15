import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getContactEmailTemplate } from './emailTemplate';

describe('Contact Email Template Sanitization', () => {
  it('escapes dangerous HTML characters to prevent XSS / HTML injection', () => {
    const maliciousContactPayload = {
      name: '<script>alert("xss")</script>',
      email: 'attacker@evil.com"><img src=x onerror=alert(1)>',
      content: 'Hello & welcome! "Quotes" and \'single quotes\' <tags>',
    };

    const renderedHtmlTemplate = getContactEmailTemplate(maliciousContactPayload);

    // Assert that raw malicious tags are NOT present
    assert.ok(!renderedHtmlTemplate.includes('<script>alert("xss")</script>'));
    assert.ok(!renderedHtmlTemplate.includes('<img src=x onerror=alert(1)>'));

    // Assert that properly escaped HTML entities ARE present
    assert.ok(renderedHtmlTemplate.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'));
    assert.ok(renderedHtmlTemplate.includes('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'));
    assert.ok(renderedHtmlTemplate.includes('Hello &amp; welcome!'));
    assert.ok(renderedHtmlTemplate.includes('&quot;Quotes&quot;'));
    assert.ok(renderedHtmlTemplate.includes('&#039;single quotes&#039;'));
  });

  it('renders standard clean contact details correctly', () => {
    const standardContactPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      content: 'I would like to discuss a software project collaboration.',
    };

    const renderedHtmlTemplate = getContactEmailTemplate(standardContactPayload);

    assert.ok(renderedHtmlTemplate.includes('John Doe'));
    assert.ok(renderedHtmlTemplate.includes('john@example.com'));
    assert.ok(renderedHtmlTemplate.includes('I would like to discuss a software project collaboration.'));
  });
});
