-- ===============================
-- CREATE TABLES
-- ===============================

-- ===============================
-- CUSTOMERS
-- ===============================
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- STAFF
-- ===============================
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- COUNTERS
-- ===============================
CREATE TABLE IF NOT EXISTS counters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    staff_id INTEGER UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE SET NULL
);

-- ===============================
-- TICKETS (QUEUE CORE)
-- ===============================
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    ticket_number INTEGER NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT DEFAULT 'waiting' CHECK (
        status IN (
            'waiting',
            'called',
            'served',
            'cancelled'
        )
    ),
    priority INTEGER DEFAULT 0,
    counter_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    called_at DATETIME NULL,
    served_at DATETIME NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
    FOREIGN KEY (counter_id) REFERENCES counters (id) ON DELETE SET NULL
);

-- ===============================
-- NOTIFICATIONS
-- ===============================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    type TEXT NOT NULL CHECK (
        type IN ('sms', 'email', 'push')
    ),
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE
);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================
CREATE INDEX IF NOT EXISTS idx_tickets_waiting ON tickets (
    status,
    priority DESC,
    created_at ASC
);

CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets (customer_id);

CREATE INDEX IF NOT EXISTS idx_tickets_counter ON tickets (counter_id);