# MongoDB to MySQL Migration Guide

MongoDB and Mongoose have been removed. The project now uses **Prisma + MySQL**.

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure database** – Add to `.env`:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/ngo"
   ```

3. **Create database** – Ensure MySQL is running and create the database:
   ```sql
   CREATE DATABASE ngo;
   ```

4. **Run migrations**:
   ```bash
   npm run db:migrate
   ```
   Or to push schema without migration history:
   ```bash
   npm run db:push
   ```

5. **Seed admin user**:
   ```bash
   npm run db:seed
   ```
   Optional env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:push` | Push schema to DB (no migration files) |
| `npm run db:seed` | Seed admin user |
| `npm run db:studio` | Open Prisma Studio |

## Schema

All models are defined in `prisma/schema.prisma`:

- AdminUser, Volunteer, Campaign, Donation, Report
- HeroSection, AboutContent, LegalInfo, BankDetails, BoardMember

## API Routes

All API routes have been updated to use Prisma. The route structure is unchanged.
