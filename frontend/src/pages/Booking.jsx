import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTrains } from "../api/railmateAPI";   // ONLY getTrains is imported now
import Toast from "../components/Toast";

const Booking = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    train_number: "",
    journey_date: "",
    seat_preference: "any",
    passengers: [{ name: "", age: "", gender: "" }],
  });
  const [toast, setToast] = useState(null);

  // Fetch trains
  useEffect(() => {
    (async () => {
      try {
        const data = await getTrains();
        setTrains(data);
      } catch {
        setToast({ message: "❌ Failed to fetch trains", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Local bookTicket function since API file doesn't export it
  const bookTicket = async (payload) => {
    const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
    const res = await fetch(`${API_URL}/book_ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Booking failed" }));
      throw new Error(err.error);
    }
    return await res.json();
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePassengerChange = (i, field, value) => {
    const passengers = [...formData.passengers];
    passengers[i][field] = value;
    setFormData({ ...formData, passengers });
  };

  const handleSeatsChange = (count) => {
    const passengers = Array.from({ length: count }, () => ({
      name: "",
      age: "",
      gender: "",
    }));
    setFormData({ ...formData, passengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const booked_by = localStorage.getItem("username");

    try {
      await bookTicket({
        ...formData,
        booked_by,
        seats: formData.passengers.length,
      });

      setToast({
        message: "🎉 Ticket booked successfully!",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: "❌ Booking failed: " + err.message,
        type: "error",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 text-white bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e]">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card text-center w-[360px] p-6 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-cyan-400 mb-5">
          🎟️ Book Your Journey
        </h1>

        {loading ? (
          <p className="text-gray-300 text-sm">⏳ Loading trains...</p>
        ) : trains.length === 0 ? (
          <p className="text-red-400 text-sm">⚠️ No trains available</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {/* Select Train */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Train</label>
              <select
                name="train_number"
                value={formData.train_number}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Train</option>
                {trains.map((t) => (
                  <option key={t.id} value={t.train_number}>
                    {t.train_name} ({t.source} ➜ {t.destination})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Date</label>
              <input
                type="date"
                name="journey_date"
                value={formData.journey_date}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>

            {/* Seat Preference */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Seat Preference
              </label>
              <select
                name="seat_preference"
                value={formData.seat_preference}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="any">Any</option>
                <option value="window">Window</option>
                <option value="aisle">Aisle</option>
                <option value="middle">Middle</option>
              </select>
            </div>

            {/* Passenger Count */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Number of Passengers
              </label>
              <input
                type="number"
                min="1"
                value={formData.passengers.length}
                onChange={(e) => handleSeatsChange(Number(e.target.value))}
                className="input w-full"
              />
            </div>

            {/* Passenger Info */}
            {formData.passengers.map((p, i) => (
              <div key={i} className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Passenger Name"
                  required
                  value={p.name}
                  onChange={(e) =>
                    handlePassengerChange(i, "name", e.target.value)
                  }
                  className="input"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Age"
                    required
                    value={p.age}
                    onChange={(e) =>
                      handlePassengerChange(i, "age", e.target.value)
                    }
                    className="input"
                  />
                  <select
                    required
                    value={p.gender}
                    onChange={(e) =>
                      handlePassengerChange(i, "gender", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              className="btn-glow w-full mt-4 py-2"
            >
              Confirm Booking
            </motion.button>
          </form>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </motion.div>
    </section>
  );
};

export default Booking;
