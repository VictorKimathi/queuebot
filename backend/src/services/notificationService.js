async function notifyTicketCalled({ ticketId, type = 'sms' }) {
  // Placeholder: you can insert into `notifications` and integrate SMS/email later.
  return { ticketId, type, sent: false };
}

module.exports = { notifyTicketCalled };

