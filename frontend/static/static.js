// === RailMate - My Journeys Page Script ===

// Change this to the logged-in user's name if your site uses authentication
const passengerName = localStorage.getItem("username") || "Sai Teja";  // fallback for testing

// Backend Base URL (adjust if needed)
const BASE_URL = "http://127.0.0.1:5000"; // change to your backend host if deployed

// Select elements
const ticketList = document.getElementById("ticketList");
const ticketModal = new bootstrap.Modal(document.getElementById("ticketModal"));
const ticketDetails = document.getElementById("ticketDetails");

// Fetch all tickets for the user
async function fetchTickets() {
    try {
        const response = await fetch(`${BASE_URL}/my_tickets?passenger_name=${encodeURIComponent(passengerName)}`);
        const data = await response.json();

        if (!response.ok) {
            ticketList.innerHTML = `<p style="color: #ccc;">${data.message || 'No tickets found.'}</p>`;
            return;
        }

        if (data.tickets && data.tickets.length > 0) {
            renderTickets(data.tickets);
        } else {
            ticketList.innerHTML = `<p style="color: #ccc;">No tickets found for ${passengerName}.</p>`;
        }

    } catch (error) {
        console.error("Error fetching tickets:", error);
        ticketList.innerHTML = `<p style="color: #ff5555;">Error loading tickets. Please try again later.</p>`;
    }
}

// Render tickets as cards
function renderTickets(tickets) {
    ticketList.innerHTML = "";

    tickets.forEach(ticket => {
        const statusClass = getStatusClass(ticket.status);

        const card = document.createElement("div");
        card.classList.add("ticket-card");

        card.innerHTML = `
            <h4>${ticket.train.name} (${ticket.train.number})</h4>
            <p>${ticket.train.source} ➜ ${ticket.train.destination}</p>
            <p><strong>PNR:</strong> ${ticket.pnr}</p>
            <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${ticket.status}</span></p>
            <button class="view-btn" onclick="viewTicket('${ticket.pnr}')">View Ticket</button>
        `;

        ticketList.appendChild(card);
    });
}

// Map status to color class
function getStatusClass(status) {
    switch (status.toUpperCase()) {
        case "CONFIRMED": return "confirmed";
        case "PARTIALLY_CONFIRMED": return "waitlisted";
        case "WAITLISTED": return "waitlisted";
        case "CANCELLED": return "cancelled";
        default: return "";
    }
}

// Fetch and display a single ticket in the modal
async function viewTicket(pnr) {
    try {
        const response = await fetch(`${BASE_URL}/ticket/${pnr}`);
        const data = await response.json();

        if (!response.ok) {
            ticketDetails.innerHTML = `<p style="color:#ff7777;">Ticket not found.</p>`;
            ticketModal.show();
            return;
        }

        const ticket = data.ticket;

        let seatInfo = "";
        if (ticket.seats && ticket.seats.length > 0) {
            seatInfo = ticket.seats.map(s => `${s.seat_no || 'N/A'} (${s.type})`).join(", ");
        } else {
            seatInfo = "No seats assigned (Waitlisted)";
        }

        ticketDetails.innerHTML = `
            <p><strong>PNR:</strong> ${ticket.pnr}</p>
            <p><strong>Passenger:</strong> ${ticket.passenger.name}</p>
            <p><strong>Train:</strong> ${ticket.train.name} (${ticket.train.number})</p>
            <p><strong>Route:</strong> ${ticket.train.source} ➜ ${ticket.train.destination}</p>
            <p><strong>Seats:</strong> ${seatInfo}</p>
            <p><strong>Status:</strong> <span class="status-badge ${getStatusClass(ticket.status)}">${ticket.status}</span></p>
            <p><strong>Issued On:</strong> ${new Date(ticket.issued_on).toLocaleString()}</p>
        `;

        ticketModal.show();
    } catch (error) {
        console.error("Error fetching ticket:", error);
        ticketDetails.innerHTML = `<p style="color:#ff7777;">Error loading ticket details.</p>`;
        ticketModal.show();
    }
}

// Load tickets when page opens
document.addEventListener("DOMContentLoaded", fetchTickets);
