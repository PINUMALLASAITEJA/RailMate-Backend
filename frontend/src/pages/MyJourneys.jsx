import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BASE_URL = "https://rail-mate-backend.vercel.app";

const MyJourneys = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (username) fetchTickets();
    return () => {
      document.body.style.overflow = "";
    };
  }, [username]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${BASE_URL}/my_tickets?booked_by=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (res.ok && data.tickets) setTickets(data.tickets);
      else setTickets([]);
    } catch (err) {
      console.error("❌ Error fetching tickets:", err);
      setTickets([]);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-600 text-white";
      case "PARTIALLY_CONFIRMED":
        return "bg-yellow-600 text-white";
      case "WAITLISTED":
        return "bg-orange-500 text-white";
      case "CANCELLED":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeTicket = () => {
    setShowModal(false);
    setSelectedTicket(null);
    document.body.style.overflow = "";
  };

  const cancelPassenger = async (pnr, passenger_name) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      const res = await fetch(`${BASE_URL}/cancel_ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr, passenger_name }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ type: "success", message: data.message });
        fetchTickets();
        setSelectedTicket((prev) => ({
          ...prev,
          passengers: prev.passengers.filter((p) => p.name !== passenger_name),
        }));
      } else {
        setToast({ type: "error", message: data.error || "Cancellation failed" });
      }
    } catch (err) {
      console.error("❌ Cancel error:", err);
      setToast({ type: "error", message: "Something went wrong" });
    }

    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e] text-white px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-cyan-400 mb-2">🎟️ My Journeys</h1>
          <p className="text-gray-300 text-sm">
            All tickets booked under <span className="text-cyan-400">{username}</span>
          </p>
        </div>

        {tickets.length === 0 ? (
          <p className="text-gray-400 text-lg text-center mt-10">No tickets found for your account.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {tickets.map((t) => (
              <motion.div
                key={t.pnr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card w-[320px] p-5 rounded-2xl text-center border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                <h2 className="text-lg font-semibold text-cyan-400 mb-1">
                  {t.train?.name || "Train"} ({t.train?.number || "—"})
                </h2>
                <p className="text-gray-300 text-sm mb-1">
                  {t.train?.source} ➜ {t.train?.destination}
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  Journey: {t.journey_date ? new Date(t.journey_date).toLocaleDateString() : "N/A"}
                </p>

                <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(t.status)}`}>
                  {t.status}
                </span>

                {/* UPDATED 🔥 */}
                <button onClick={() => openTicket(t)} className="nav-btn w-full text-sm py-2">
                  🚆 View Ticket
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeTicket}>
          <div className="modal-box glass-card" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
            <button className="modal-close" onClick={closeTicket} aria-label="Close ticket">
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4 text-center">Ticket Details</h2>

            <div className="space-y-2 text-gray-200 text-sm">
              <p><strong>PNR:</strong> {selectedTicket.pnr}</p>
              <p><strong>Train:</strong> {selectedTicket.train?.name} ({selectedTicket.train?.number})</p>
              <p><strong>Route:</strong> {selectedTicket.train?.source} ➜ {selectedTicket.train?.destination}</p>
              <p><strong>Journey Date:</strong> {new Date(selectedTicket.journey_date).toLocaleDateString()}</p>

              <div className="mt-3">
                <strong>Passengers:</strong>
                <ul className="list-disc list-inside text-gray-300 text-xs mt-2 space-y-1">
                  {selectedTicket.passengers.map((p, i) => (
                    <li key={i} className="flex justify-between items-center bg-white/5 rounded-md px-2 py-1">
                      <span>{p.name} ({p.gender}, {p.age}y)</span>

                      {/* UPDATED 🔥 */}
                      <button className="nav-btn text-xs px-2 py-1" onClick={() => cancelPassenger(selectedTicket.pnr, p.name)}>
                        ❌ Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className={`px-2 py-1 rounded ${getStatusClass(selectedTicket.status)}`}>{selectedTicket.status}</span>
              </p>

              <p><strong>Booked On:</strong> {new Date(selectedTicket.issued_on).toLocaleString()}</p>
            </div>

            {/* UPDATED 🔥 */}
            <div className="text-center mt-5">
              <button onClick={closeTicket} className="nav-btn px-5 py-2 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-md text-sm text-white shadow-lg ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.message}
        </div>
      )}
    </>
  );
};

export default MyJourneys;
