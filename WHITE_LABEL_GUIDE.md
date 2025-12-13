# White-Label SOP Writer App - Configuration Guide

## Overview
Your application is now fully configurable! All services, pricing, and contact information can be managed through the Admin Panel without touching code.

## Quick Start

### 1. Seed the Database
```bash
cd sopwriter-backend
npx tsx scripts/seedServices.ts
```

### 2. Start the Application
```bash
# Terminal 1: Backend
cd sopwriter-backend
npm run dev

# Terminal 2: Frontend
cd sopwriter-frontend
npm run dev
```

### 3. Access Admin Panel
- Navigate to: `http://localhost:4000/admin/login`
- Default credentials:
  - **Email**: `admin@sopwriter.com`
  - Password**: `admin123`

*(Change these in `.env` file: `ADMIN_EMAIL` and `ADMIN_PASSWORD`)*

---

## Managing Your App

### Services Management (`/admin/settings`)

**Add a New Service:**
1. Click "Add Service" button
2. Fill in:
   - **Code**: Unique identifier (e.g., `RESUME_PRO`)
   - **Name**: Display name (e.g., `Professional Resume`)
   - **Category**: `documents`, `profile`, or `visa`
   - **Price**: Amount in INR
   - **Description**: What's included
3. Click "Create Service"

**Edit Service:**
- Click pencil icon next to any service
- Modify fields
- Click "Save"

**Delete Service:**
- Click trash icon
- Confirm deletion

### Configuration Settings

**Editable Settings:**
- `contact_phone` - Main support number
- `contact_whatsapp` - WhatsApp number (without +)
- `contact_email` - General inquiries
- `support_email` - Payment support
- `payment_upi_id` - UPI ID for payments
- `payment_qr_image` - Path to QR code image

**To Update:**
1. Click pencil icon next to setting
2. Edit value
3. Click "Save"

---

## White-Labeling for Clients

### Option 1: Rebrand for Each Client

1. **Update Branding**:
   - Company name in `Header.tsx` (line 23-24)
   - Logo image in `public/` folder

2. **Update All Settings** via Admin Panel:
   ```
   contact_whatsapp → Client's WhatsApp
   payment_upi_id → Client's UPI
   support_email → Client's email
   ```

3. **Customize Services**:
   - Add client-specific services
   - Remove unwanted services
   - Adjust pricing

4. **Deploy** to client's domain

### Option 2: Multi-Tenant (Future Enhancement)

Add organization/tenant support:
- Each organization has its own services & settings
- Single codebase serves multiple clients
- Admin manages multiple organizations

---

## API Endpoints

### Public
- `GET /api/config` - Fetches all active services + settings

### Admin (Requires Auth)
**Services:**
- `GET /api/admin/services`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

**Settings:**
- `GET /api/admin/settings`
- `PUT /api/admin/settings/:key`
- `DELETE /api/admin/settings/:key`

---

## Environment Variables

### Backend (`.env`)
```env
# Admin Credentials
ADMIN_EMAIL=admin@sopwriter.com
ADMIN_PASSWORD=admin123

# Database
MONGO_URI=mongodb://localhost:27017/sopwriter

# JWT
JWT_SECRET=your-secret-key

# Email (SendGrid)
SENDGRID_API_KEY=your-key
EMAIL_FROM=noreply@sopwriter.com
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## Benefits of This Architecture

✅ **No Code Changes Needed** - Entire app configured via Admin UI
✅ **Easy White-Labeling** - Rebrand in minutes for new clients
✅ **Dynamic Pricing** - Update prices instantly
✅ **Flexible Services** - Add/remove offerings on demand
✅ **Centralized Configuration** - Single source of truth
✅ **Type-Safe** - Full TypeScript support
✅ **Fallback Support** - Works even if API fails

---

## Troubleshooting

**Frontend doesn't load config:**
- Check browser console for errors
- Verify backend is running at `VITE_API_URL`
- Check `/api/config` endpoint in browser

**Admin can't log in:**
- Verify `.env` has correct `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Check JWT_SECRET is set
- Look at backend logs

**Seed script fails:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify database permissions

---

## Next Enhancements

1. **File Upload** - Upload QR code via admin panel
2. **Branding Settings** - Logo, colors, company name in DB
3. **Multi-Language** - Support multiple languages
4. **Email Templates** - Editable email templates in admin
5. **Analytics** - Track which services are most popular

---

Made with ❤️ for easy white-labeling!
