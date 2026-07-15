# Polyglot Portfolio - Express API

[![Express Version](https://img.shields.io/badge/Express-v5.x-000000?logo=express&logoColor=white)](https://expressjs.com) [![Node Version](https://img.shields.io/badge/Node.js-%5E20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A robust backend REST API built with Node.js and Express to serve content for the modern personal portfolio frontend. This is one of the three backend implementations demonstrating cross-stack compatibility.

---

## Key Features

*   **Authentication**: Secure login and JWT-based session management for the admin dashboard.
*   **Content Management API**: Full CRUD endpoints for managing projects, work experiences, technology stacks, and categories.
*   **File Uploads**: Handling image and asset uploads for portfolio items.

---

## Tech Stack & Libraries

*   **Backend**: Node.js & Express (v5) with TypeScript (`tsx` runner)
*   **Database / ORM**: PostgreSQL via Sequelize ORM
*   **Caching**: Redis (via `ioredis`)
*   **Emailing**: Resend SDK
*   **Authentication**: JSON Web Tokens (JWT) & Bcryptjs

---

## Installation & Setup

### Steps
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database connection strings and JWT secrets.
3.  **Run Service**:
    *   Development: `npm run dev`
    *   Production: `npm start`

---

## Author

**Churma16**

---

## License

This project is licensed under the [MIT License](LICENSE).
