const ticketService = require('./ticketService');

// Thin wrapper (kept for your project structure)
async function callNextTicket({ counterId, serviceType }) {
  return ticketService.callNext({ counterId, serviceType });
}

module.exports = { callNextTicket };

