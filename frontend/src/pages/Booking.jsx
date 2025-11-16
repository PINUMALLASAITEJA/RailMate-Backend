import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTrains, bookTicket } from "../api/railmateAPI";
import Toast from "../components/Toast";

const Booking = () => {
  const [trains, setTrains] = useState([]);
  const [formData, setFormData] = useState({
    train_number: "",
    journey_date: "",
    seat_preference: "any",
    passengers: [{ name: "", age: "", gender: "" }],
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrains();
        setTrains(data);
      } catch {
        setToast({ message: "❌ Failed to fetch trains", type: "error" });
      }
    })();
  }, []);

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
    const booked_by = sessionStorage.getItem("username");
    try {
      const res = await bookTicket({
        ...formData,
        booked_by,
        seats: formData.passengers.length,
      });
      setToast({
        message: `✅ ${res.message || "Ticket booked successfully!"}`,
        type: "success",
      });
    } catch {
      setToast({ message: "❌ Booking failed.", type: "error" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 text-white bg-gradient-to-br from-[#08111e] via-[#0b1628] to-[#101a2e]">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card text-center w-[340px] p-6 shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-cyan-400 mb-5">
          🎟️ Book Your Journey
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          {/* Train Select */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Train</label>
            <select
              name="train_number"
              value={formData.train_number}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select Train</option>
              {trains.map((t) => (
                <option key={t.train_number} value={t.train_number}>
                  {t.train_name} ({t.source} ➜ {t.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Journey Date */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Journey Date
            </label>
            <input
              type="date"
              name="journey_date"
              value={formData.journey_date}
              onChange={handleChange}
              required
              className="input"
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
              className="input"
            >
              <option value="any">Any</option>
              <option value="window">Window</option>
              <option value="aisle">Aisle</option>
              <option value="middle">Middle</option>
            </select>
          </div>

          {/* Number of Passengers */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Number of Passengers
            </label>
            <input
              type="number"
              min="1"
              value={formData.passengers.length}
              onChange={(e) => handleSeatsChange(Number(e.target.value))}
              className="input"
            />
          </div>

          {/* Passenger Fields */}
          {formData.passengers.map((p, i) => (
            <div key={i} className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                placeholder="Passenger Name"
                value={p.name}
                onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                required
                className="input"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) =>
                    handlePassengerChange(i, "age", e.target.value)
                  }
                  required
                  className="input"
                />
                <select
                  value={p.gender}
                  onChange={(e) =>
                    handlePassengerChange(i, "gender", e.target.value)
                  }
                  required
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

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="btn-glow w-full mt-4 py-2"
          >
            Confirm Booking
          </motion.button>
        </form>

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
