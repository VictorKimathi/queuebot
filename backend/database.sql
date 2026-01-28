-- ===============================
-- CREATE DATABASE
-- ===============================
CREATE DATABASE queue_system;

-- ===============================
-- USE DATABASE
-- ===============================
USE queue_system;

-- ===============================
-- CUSTOMERS
-- ===============================
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- STAFF
-- ===============================
CREATE TABLE staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('staff', 'admin') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- COUNTERS
-- ===============================
CREATE TABLE counters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    staff_id BIGINT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- ===============================
-- TICKETS (QUEUE CORE)
-- ===============================
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    ticket_number INT NOT NULL,
    service_type VARCHAR(50) NOT NULL,

    status ENUM('waiting', 'called', 'served', 'cancelled') DEFAULT 'waiting',
    priority INT DEFAULT 0,
    counter_id BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    served_at TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (counter_id) REFERENCES counters(id) ON DELETE SET NULL
);

-- ===============================
-- NOTIFICATIONS
-- ===============================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT,
    type ENUM('sms', 'email', 'push') NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================
CREATE INDEX idx_tickets_waiting
ON tickets(status, priority DESC, created_at ASC);

CREATE INDEX idx_tickets_customer
ON tickets(customer_id);

CREATE INDEX idx_tickets_counter
ON tickets(counter_id);