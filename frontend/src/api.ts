const API_BASE = '/api';

// Types
export interface Ticket {
    id: number;
    ticket_number: number;
    customer_id: number;
    service_type: string;
    status: 'waiting' | 'called' | 'served' | 'cancelled';
    priority: number;
    counter_id: number | null;
    created_at: string;
    called_at: string | null;
    served_at: string | null;
}

export interface TicketStatus {
    ticket: Ticket;
    ahead: number;
}

export interface Staff {
    id: number;
    name: string;
    email: string;
    role: 'staff' | 'admin';
}

export interface LoginResponse {
    ok: boolean;
    token: string;
    staff: Staff;
}

// API Functions

export async function joinQueue(
    name: string,
    phoneNumber?: string,
    serviceType: string = 'general'
): Promise<{ ok: boolean; ticket: Ticket }> {
    const res = await fetch(`${API_BASE}/customers/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, serviceType }),
    });
    return res.json();
}

export async function getWaitingTickets(
    serviceType?: string
): Promise<{ ok: boolean; tickets: Ticket[] }> {
    const url = serviceType
        ? `${API_BASE}/tickets/waiting?serviceType=${encodeURIComponent(serviceType)}`
        : `${API_BASE}/tickets/waiting`;
    const res = await fetch(url);
    return res.json();
}

export async function getNowServing(): Promise<{ ok: boolean; ticket: Ticket | null }> {
    const res = await fetch(`${API_BASE}/tickets/now-serving`);
    return res.json();
}

export async function getTicketStatus(ticketId: number): Promise<{ ok: boolean } & TicketStatus> {
    const res = await fetch(`${API_BASE}/customers/tickets/${ticketId}/status`);
    return res.json();
}

export async function staffLogin(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function callNextTicket(
    token: string,
    counterId?: number,
    serviceType?: string
): Promise<{ ok: boolean; ticket: Ticket }> {
    const res = await fetch(`${API_BASE}/staff/call-next`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ counterId, serviceType }),
    });
    return res.json();
}

export async function markServed(
    ticketId: number,
    token: string
): Promise<{ ok: boolean; ticket: Ticket }> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/serve`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}

// Auth helpers
export function getStoredToken(): string | null {
    return localStorage.getItem('queuebot_token');
}

export function storeToken(token: string): void {
    localStorage.setItem('queuebot_token', token);
}

export function clearToken(): void {
    localStorage.removeItem('queuebot_token');
}
