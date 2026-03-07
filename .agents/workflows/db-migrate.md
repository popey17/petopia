---
description: How to run Prisma migrations and generate the client
---

1. Ensure the database is running and the `DATABASE_URL` is set in `backend/.env`.
2. Navigate to the backend directory: `cd backend`.
// turbo
3. Run migrations and generate the Prisma client:
```bash
npx prisma migrate dev
```
