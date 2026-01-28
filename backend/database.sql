-- ===============================
-- ENUM TYPES
-- ===============================
CREATE TYPE ticket_status AS ENUM ('waiting', 'called', 'served', 'cancelled');
CREATE TYPE staff_role AS ENUM ('staff', 'admin');
CREATE TYPE notification_type AS ENUM ('sms', 'email', 'push');

-- ===============================
-- CUSTOMERS
-- ===============================
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- STAFF
-- ===============================
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role staff_role DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- COUNTERS
-- ===============================
CREATE TABLE counters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    staff_id BIGINT UNIQUE REFERENCES staff(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- TICKETS (QUEUE CORE)
-- ===============================
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    ticket_number INT NOT NULL,
    service_type VARCHAR(50) NOT NULL,

    status ticket_status DEFAULT 'waiting',
    priority INT DEFAULT 0 CHECK (priority >= 0),

    counter_id BIGINT REFERENCES counters(id) ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    called_at TIMESTAMP,
    served_at TIMESTAMP,

    CONSTRAINT served_after_called
    CHECK (served_at IS NULL OR called_at IS NOT NULL)
);

-- ===============================
-- NOTIFICATIONS
-- ===============================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
-- INDEXES FOR QUEUE PERFORMANCE
-- ===============================

-- Fast retrieval of next customer
CREATE INDEX idx_tickets_waiting
ON tickets(status, priority DESC, created_at ASC);

-- Customer history
CREATE INDEX idx_tickets_customer
ON tickets(customer_id);

-- Counter workload tracking
CREATE INDEX idx_tickets_counter
ON tickets(counter_id);

-- ===============================
-- QUERY TO GET NEXT PERSON IN QUEUE
-- ===============================
-- SELECT *
-- FROM tickets
-- WHERE status = 'waiting'
-- ORDER BY priority DESC, created_at ASC
-- LIMIT 1;