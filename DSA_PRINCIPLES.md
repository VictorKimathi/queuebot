# Data Structures & Algorithms in QueueBot

This document explains the core DSA principles implemented in this queue management system.

---

## 🔄 Queue Data Structure (FIFO)

A **Queue** is a linear data structure that follows the **First-In-First-Out (FIFO)** principle. The first element added is the first one to be removed—just like a real-world queue.

### Operations
| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| **Enqueue** | Add element to back | O(1) |
| **Dequeue** | Remove element from front | O(1) |
| **Peek** | View front element | O(1) |
| **IsEmpty** | Check if queue is empty | O(1) |

---

## 📍 Implementation in Our Codebase

### 1. Enqueue Operation - `joinQueue()`
**File:** `backend/src/services/ticketService.js`

```javascript
async function joinQueue({ name, phoneNumber, serviceType, priority }) {
  return withTransaction((db) => {
    // Create customer
    const custInfo = db.prepare(
      `INSERT INTO customers (name, phone_number) VALUES (?, ?)`
    ).run(name, phoneNumber);

    // ENQUEUE: Add ticket to the queue with current timestamp
    const ticketInfo = db.prepare(
      `INSERT INTO tickets (customer_id, ticket_number, service_type, priority) 
       VALUES (?, ?, ?, ?)`
    ).run(customerId, 0, serviceType, priority);
    
    // Ticket enters queue with status='waiting' and created_at=NOW()
    return ticket;
  });
}
```

**How it works:**
- New tickets are inserted with `status='waiting'`
- `created_at` timestamp is automatically set (insertion order)
- This simulates adding to the **back of the queue**

---

### 2. Dequeue Operation - `callNext()`
**File:** `backend/src/services/ticketService.js`

```javascript
async function callNext({ counterId, serviceType }) {
  return withTransaction((db) => {
    // DEQUEUE: Get the FIRST waiting ticket (FIFO order)
    let sql = `SELECT id FROM tickets WHERE status = 'waiting'`;
    sql += ` ORDER BY priority DESC, created_at ASC LIMIT 1`;
    //                                ^^^^^^^^^^^^^^
    //                                FIFO: earliest first!
    
    const next = db.prepare(sql).get();
    if (!next) return null;

    // Remove from queue by changing status
    db.prepare(
      `UPDATE tickets SET status = 'called', called_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    ).run(next.id);

    return ticket;
  });
}
```

**How it works:**
- `ORDER BY created_at ASC` ensures **earliest ticket is selected first** (FIFO)
- `priority DESC` allows priority queuing (VIP tickets served first within their arrival order)
- Status change from `waiting` → `called` effectively **removes from queue**

---

### 3. Peek Operation - `nowServing()`
**File:** `backend/src/models/ticketModel.js`

```javascript
async function nowServing() {
  // PEEK: View the currently called ticket without removing
  const rows = await query(
    `SELECT * FROM tickets WHERE status = 'called' 
     ORDER BY called_at DESC LIMIT 1`
  );
  return rows[0] || null;
}
```

---

### 4. View Queue - `listWaitingTickets()`
**File:** `backend/src/models/ticketModel.js`

```javascript
async function listWaitingTickets({ serviceType } = {}) {
  // View all elements in queue (in FIFO order)
  let sql = `SELECT * FROM tickets WHERE status = 'waiting' 
             ORDER BY priority DESC, created_at ASC`;
  return query(sql);
}
```

---

## 🗄️ Database as Queue Storage

Instead of using an in-memory array, we use **SQLite** as persistent queue storage:

```sql
-- Queue element structure
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number INTEGER NOT NULL,
    status TEXT DEFAULT 'waiting',  -- Queue position indicator
    priority INTEGER DEFAULT 0,      -- Priority level
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Insertion order
    called_at DATETIME,              -- Dequeue timestamp
    served_at DATETIME               -- Completion timestamp
);
```

### Status Flow (Queue Lifecycle)
```
┌──────────┐    callNext()    ┌────────┐    markServed()    ┌────────┐
│ waiting  │ ───────────────► │ called │ ────────────────► │ served │
└──────────┘                  └────────┘                    └────────┘
     ▲                             │
     │                             │ cancelTicket()
  joinQueue()                      ▼
                              ┌───────────┐
                              │ cancelled │
                              └───────────┘
```

---

## 🎯 Priority Queue Extension

Our implementation extends the basic FIFO queue with **priority levels**:

```javascript
ORDER BY priority DESC, created_at ASC
```

This means:
1. Higher priority tickets are served first
2. Within same priority, FIFO order is maintained

**Example:**
| Ticket | Priority | Created At | Position |
|--------|----------|------------|----------|
| A | 5 (VIP) | 10:05 | **1st** |
| B | 0 | 10:01 | 2nd |
| C | 0 | 10:02 | 3rd |
| D | 0 | 10:03 | 4th |

Even though B was created first, A (priority 5) is served before B, C, D.

---

## 📊 Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Join Queue | O(1) | O(1) |
| Call Next | O(log n) | O(1) |
| List Waiting | O(n) | O(n) |
| Now Serving | O(1) | O(1) |

*Note: O(log n) for callNext due to indexed SQL query on status + created_at*

---

## 📚 Key Files

- `backend/src/services/ticketService.js` - Queue operations
- `backend/src/models/ticketModel.js` - Database queries
- `backend/database.sql` - Queue schema definition
