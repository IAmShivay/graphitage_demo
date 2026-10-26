# Graphitage Demo

Production-grade eCommerce store built with Next.js App Router, Turbopack, MongoDB (Mongoose), Winston logger, Redux Toolkit Query (RTKQ), and Role-Based Access Control (RBAC).

## Features

- **Next.js Turbopack**: Fast local development via `next dev --turbo`.
- **Redux Toolkit Query (RTKQ)**: Full client state management and data fetching cache with automatic tag invalidation across all pages.
- **MongoDB + Mongoose**: Persistent storage for products and users with global connection caching.
- **Configurable Winston Logger**: Structured server logging with file rotation and dev console output toggleable via `.env`.
- **Role-Based Access Control (RBAC)**: Secure HTTP-only JWT cookies with middleware guard for admin routes.
- **Customer Registration Only**: Public registration creates `customer` accounts. Admin accounts are seeded or assigned by administrators.
- **Formik & Yup Validation**: All forms and API endpoints utilize Formik and Yup schemas for declarative validation without custom regex checks.
- **Backend Sorting & Filtering**: Products sorted directly at the database level (`newest`, `oldest`, `price_asc`, `price_desc`, `name_asc`, `name_desc`).
- **Currency**: All pricing formatted in Indian Rupees (INR ₹).
- **Public Route**: Product showcase at `/` and details at `/products/[id]`.
- **Admin CRUD Route**: Product inventory management at `/admin/products`, `/admin/products/new`, and `/admin/products/[id]/edit`.

## Product Search Algorithm

The product search implements a sanitized case-insensitive regex query backed by MongoDB compound indexes:

1. **Algorithm Type**: Case-insensitive substring matching (`$regex` with `$options: "i"`).
2. **Search Fields**: Matches against both `title` and `description` using MongoDB `$or` logic.
3. **Query Sanitization**: Incoming search terms are escaped using an escape function:
   ```ts
   text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
   ```
   This prevents Regular Expression Denial of Service (ReDoS) and NoSQL regex operator injection.
4. **Database Indexing**: The `Product` schema defines a compound index on `{ title: "text", category: 1 }` to accelerate queries and category partitioning.
5. **Combined Execution**: Search filters run concurrently with category filtering and backend database-level sorting in a single MongoDB query.

## Winston Logger Development Toggle

In development, Winston console output can be enabled or silenced via `.env.local`:

- `SHOW_DEV_LOGGER=true`: Enables formatted, colorized console output in development.
- `SHOW_DEV_LOGGER=false`: Silences console logs during development while preserving file logs in `logs/combined.log` and `logs/error.log`.

In production (`NODE_ENV=production`), structured JSON logging to persistent log files remains active regardless of this dev setting.

## Security Headers & Hardening

The application applies production-grade HTTP security headers configured in `next.config.mjs`:

- **Strict-Transport-Security (HSTS)**: `max-age=63072000; includeSubDomains; preload` enforces HTTPS and protects against protocol downgrade attacks.
- **X-Frame-Options**: `SAMEORIGIN` prevents clickjacking attacks by disallowing unauthorized iframes.
- **X-Content-Type-Options**: `nosniff` prevents browsers from MIME-sniffing responses away from the declared content-type.
- **X-XSS-Protection**: `1; mode=block` enables built-in browser reflected XSS filters.
- **Referrer-Policy**: `origin-when-cross-origin` limits sensitive referrer leakage across origins.
- **Permissions-Policy**: Restricts access to sensitive browser features (camera, microphone, geolocation, browsing-topics).
- **Hide Powered-By**: `poweredByHeader: false` suppresses the `X-Powered-By: Next.js` header to prevent framework fingerprinting.
- **Input Sanitization**: Search terms are escaped to prevent ReDoS and NoSQL regex injection.
- **BSON ID Validation**: MongoDB ObjectIds are validated with `mongoose.Types.ObjectId.isValid` prior to database queries.

## Environment Setup

Create `.env.local` in project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_turbopack
JWT_SECRET=super_secret_production_ready_jwt_signing_key_ecommerce_2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
SHOW_DEV_LOGGER=true
```

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed demo accounts and catalog:
   ```bash
   npm run seed
   ```
   Or click the "Seed DB" button in the top navigation bar.

3. Start development server with Turbopack:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Seed Accounts

- **Admin Account**: `admin@ecommerce.com` / `Admin@123`
- **Customer Account**: `customer@ecommerce.com` / `Customer@123`
# graphitage_demo
