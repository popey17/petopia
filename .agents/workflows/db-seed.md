---
description: How to seed the database with pet-themed mock data
---

1. Ensure the database is running and migrations have been applied.
2. Navigate to the backend directory: `cd backend`.
// turbo
3. Seed the database:
```bash
npm run prisma:seed
```
*Note: This uses the seed script defined in `backend/package.json`.*
