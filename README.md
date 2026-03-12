# NGO Next.js App

Full-stack Next.js application for an NGO with MongoDB, Mongoose, and JWT authentication.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   - `MONGODB_URI` – MongoDB connection string ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
   - `JWT_SECRET` – Secret for admin JWT (e.g. `openssl rand -base64 32`)
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` – From [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Images and reports are stored locally in `public/uploads/`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – For confirmation emails (volunteer, donation)

3. **Seed admin user (optional):**
   ```bash
   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=yourpassword npm run seed:admin
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin Authentication

- **Login:** `/admin/login` – JWT stored in HTTP-only cookie
- **Protected routes:** `/admin/dashboard`, `/api/admin/*`
- **Logout:** POST `/api/auth/logout` – clears auth cookie
- **Middleware** redirects unauthorized users to `/admin/login`

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/volunteer` | No | Register volunteer |
| POST | `/api/payment/create-order` | No | Create Razorpay order |
| POST | `/api/payment/verify` | No | Verify payment & save donation |
| GET | `/api/campaign?status=active` | No | List campaigns (public) |
| POST | `/api/auth/login` | No | Admin login (sets HTTP-only cookie) |
| POST | `/api/auth/logout` | No | Admin logout |
| GET | `/api/admin/volunteers` | Admin | List volunteers |
| GET | `/api/admin/donations` | Admin | List donations |
| GET/POST | `/api/admin/campaigns` | Admin | List/create campaigns |
| GET/PATCH/DELETE | `/api/admin/campaigns/[id]` | Admin | Get/update/delete campaign |
| POST | `/api/admin/upload` | Admin | Upload image (local storage) |
| GET | `/api/reports` | No | List reports (public) |
| GET/POST | `/api/admin/reports` | Admin | List/create reports |
| POST | `/api/admin/reports/upload` | Admin | Upload PDF |
| DELETE | `/api/admin/reports/[id]` | Admin | Delete report |

## Project Structure

- `src/app/` – Main application pages and API routes
- `src/components/` – Shared React components
- `src/models/` – Mongoose schemas
- `src/lib/` – Database, auth, utilities
- `src/services/` – API client helpers
- `src/types/` – TypeScript types

---

For more information, see the [Next.js documentation](https://nextjs.org/docs).
