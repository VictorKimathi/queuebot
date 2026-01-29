# QueueBot - Setup Guide

## Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Git**

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/VictorKimathi/queuebot.git
cd queuebot
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run db:init    # Initialize SQLite database
npm start          # Starts on http://localhost:4000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## Create Test Staff User
Run this in the `backend` directory to create a staff login:
```bash
node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('./queue_system.db');
const hash = bcrypt.hashSync('password123', 10);
db.prepare('INSERT INTO staff (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run('Admin', 'admin@test.com', hash, 'admin');
console.log('Created: admin@test.com / password123');
db.close();
"
```

---

## URLs
| Page | URL |
|------|-----|
| Customer Home | http://localhost:5173 |
| Get Ticket | http://localhost:5173/customer/ticket |
| Queue Status | http://localhost:5173/customer/status |
| Staff Dashboard | http://localhost:5173/staff |
| API Docs (Swagger) | http://localhost:4000/api-docs |

---

## Troubleshooting

**Build errors with `better-sqlite3`?**
Install build tools:
```bash
# Ubuntu/WSL
sudo apt update && sudo apt install build-essential python3

# macOS
xcode-select --install
```

**Port already in use?**
Kill the process or change port in `.env`

**Database issues?**
Delete `backend/queue_system.db` and re-run `npm run db:init`
