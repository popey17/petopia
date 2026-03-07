---
name: petopia-stack-development
description: Executes full-stack development tasks for the Petopia platform using React, Zustand, Node.js, Express, and Prisma. Use this skill when generating UI components, setting up API routes, writing database queries, or writing SCSS.
---

# Petopia Full-Stack Skill Guidelines

When tasked with building or modifying features for Petopia, adhere to the following strict conventions:

## 1. Backend Development (Node.js, Express, TypeScript)
* **Architecture:** Use a Controller-Service-Route pattern. Controllers handle request/response, Services handle business logic (Prisma queries), and Routes define endpoints.
* **Type Safety:** Always define interfaces for request bodies, query params, and responses. Use TypeScript's utility types (e.g., `Partial`, `Pick`) where appropriate.
* **Error Handling:** Use custom error classes and a global error-handling middleware. Never expose raw Prisma/S3 errors to the client.
* **File Uploads:** Use the `r2Client` in `backend/src/lib/r2.ts` for all media uploads. Store only the public URL in the database.

## 2. Database (Prisma Modular Schema)
* **Modular Schema:** Define models in `backend/prisma/schema/models/*.prisma`. Use descriptive filenames (e.g., `user.prisma`).
* **Relations:** Always define explicit relations between models. Ensure `@relation` attributes are correctly placed and named.
* **Migrations:** Perform migrations only after verifying the local schema builds correctly.

## 3. Frontend Development (React & Zustand)
*Note: This section applies when the frontend is initialized.*
* **Components:** Write functional components using modern React Hooks. Export components as default.
* **State Management:** Use Zustand for global state. Keep stores modular.

## 4. SCSS Styling (Strictly Nested)
*Note: This section applies when the frontend is initialized.*
* **Strict Nesting:** ALL SCSS must be written using nested rules that closely mirror the HTML/JSX DOM structure.
* **Component Scoping:** Wrap the stylesheet inside a single parent class matching the component name.
