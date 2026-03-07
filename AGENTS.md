# Petopia - Core Project Rules

## Project Overview
* **Name:** Petopia
* **Description:** A highly visual, Instagram-style social media platform dedicated entirely to pets.
* **Target Audience:** Pet owners looking to share photos/videos, engage with pet content, and connect with other pet lovers.

## Tech Stack
* **Backend:** Node.js, Express.js (v5+), Typescript.
* **Database:** PostgreSQL with Prisma ORM.
* **Storage:** Cloudflare R2 for all media (images/videos).
* **Frontend (Planned):** React, React Router, Zustand, SCSS.

## Global Agent Directives
1. **Architectural Separation:** Maintain a clean separation of concerns. The Express backend acts as a REST API serving JSON.
2. **Prisma Schema (Modular):** The project uses the `prismaSchemaFolder` pattern. Define models in `backend/prisma/schema/models/*.prisma` rather than a single file.
3. **Database First:** When designing new features, always start by defining/modifying the Prisma models, then build the Express controllers, and finally build the React UI.
4. **No Boilerplate Filler:** Output functional, production-ready code. Use pet-themed mock data (e.g., "Golden Retriever", "Luna playing fetch", "Dog Park") when generating examples.
