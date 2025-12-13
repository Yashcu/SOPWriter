# SopWriter Backend

Backend service for SopWriter (formerly GDocs Backend), a collaborative documentation platform.

## 🚀 Tech Stack
- **Runtime**: Node.js (Latest LTS)
- **Language**: TypeScript (Strict Mode)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: Zod
- **Testing**: Jest + ts-jest
- **CI/CD**: GitHub Actions

## 🛠️ Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Start Infrastructure (Docker)**
   Start MongoDB and Mongo Express (Admin UI) locally:
   ```bash
   npm run docker:dev
   ```
   > Mongo Express available at: http://localhost:8081

4. **Seed Database**
   Initialize database with required services and admin user:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server is watch mode |
| `npm run build` | Compile TypeScript to JavaScript in `dist/` |
| `npm start` | Run the production build |
| `npm test` | Run test suite with Jest |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run docker:dev` | Start local dev infrastructure |
| `npm run docker:down` | Stop local dev infrastructure |

## 📂 Project Structure

```
src/
├── config/         # Environment & DB configuration
├── models/         # Database schemas (Mongoose + Zod)
├── controllers/    # API Request Handlers
├── services/       # Business Logic Layer
├── routes/         # API Route definitions
├── middleware/     # Custom Express Middleware (Auth, Error, etc.)
├── validators/     # Input validation schemas
├── utils/          # Shared utilities
└── tests/          # Unit & Integration tests
```

## 📚 Documentation
- [API Documentation](docs/openapi.md)
- [Deployment Guide](docs/deployment.md)
- [Admin Verification SOP](docs/sop_admin_verification.md)

## 📄 License
MIT
