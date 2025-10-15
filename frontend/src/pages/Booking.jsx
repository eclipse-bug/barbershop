import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Scissors } from "lucide-react";

export default function Booking() {
  const [form, setForm] = useState({
    service: "",
    barber_id: "",
    date: "",
    time: "",
  });
  const [user, setUser] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [holidays, setHolidays] = useState([]); // 🔹 zile libere
  const [message, setMessage] = useState("");
  const dateRef = useRef(null);

  // 🔹 Ore disponibile
  const generateTimes = () => {
    const times = [];
    let start = 8 * 60;
    const end = 20 * 60;
    while (start <= end) {
      const h = Math.floor(start / 60).toString().padStart(2, "0");
      const m = (start % 60).toString().padStart(2, "0");
      times.push(`${h}:${m}`);
      start += 40;
    }
    return times;
  };
  const allTimes = generateTimes();

  // 🔹 Citim userul logat
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("loggedUser")) ||
      JSON.parse(sessionStorage.getItem("loggedUser"));
    setUser(stored);
  }, []);

  // 🔹 Preia barberul ales din pagina /barbers
  useEffect(() => {
    const selectedBarber = JSON.parse(localStorage.getItem("selectedBarber"));
    if (selectedBarber) {
      setForm((prev) => ({ ...prev, barber_id: selectedBarber.id }));
      localStorage.removeItem("selectedBarber");
    }
  }, []);

  // 🔹 Încarcă frizerii
  useEffect(() => {
    fetch("http://localhost/barbershop/frontend/backend/api/get_barbers.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBarbers(data);
      })
      .catch(() => setBarbers([]));
  }, []);

  // 🔹 Încarcă zilele libere pentru frizerul selectat
  useEffect(() => {
    if (form.barber_id) {
      fetch(
        `http://localhost/barbershop/frontend/backend/api/get_holidays.php?barber_id=${form.barber_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setHolidays(data);
        })
        .catch(() => setHolidays([]));
    }
  }, [form.barber_id]);

  // 🔹 Obține orele ocupate
  useEffect(() => {
    if (form.date && form.barber_id) {
      fetch(
        `http://localhost/barbershop/frontend/backend/api/get_booked_times.php?date=${form.date}&barber_id=${form.barber_id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const normalized = data.map((t) => t.substring(0, 5));
          setBookedTimes(normalized);
        })
        .catch(() => setBookedTimes([]));
    } else {
      setBookedTimes([]);
    }
  }, [form.date, form.barber_id]);

  // 🔹 Verifică dacă data selectată e zi liberă
  const isHoliday = holidays.includes(form.date);

  // 🔹 Când schimbăm inputurile
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Trimite programarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Trebuie să fii logat pentru a face o programare!");
      return;
    }

    const { service, barber_id, date, time } = form;
    if (!service || !barber_id || !date || !time) {
      setMessage("Completează toate câmpurile!");
      return;
    }

    // ⛔ Dacă e concediu, interzicem
    if (isHoliday) {
      setMessage("Frizerul este în concediu în această zi. Alege altă dată!");
      return;
    }

    const formData = new FormData();
    formData.append("client_id", user.id);
    formData.append("barber_id", barber_id);
    formData.append("nume", `${user.prenume} ${user.nume}`);
    formData.append("telefon", user.telefon);
    formData.append("service", service);
    formData.append("date", date);
    formData.append("time", time);

    try {
      const res = await fetch(
        "http://localhost/barbershop/frontend/backend/api/book_appointment.php",
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setMessage("✅ Programarea a fost înregistrată cu succes!");
        setForm({ service: "", barber_id: "", date: "", time: "" });
        setBookedTimes((prev) => [...prev, time]);
      } else {
        setMessage(data.error || "Eroare necunoscută!");
      }
    } catch (err) {
      setMessage("Eroare la conexiunea cu serverul.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/50 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl p-10 w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Programează-te la tuns
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {user && (
            <div className="text-sm text-gray-300 mb-3">
              Client:{" "}
              <span className="text-[#d4af37] font-semibold">
                {user.prenume} {user.nume}
              </span>{" "}
              ({user.telefon})
            </div>
          )}

          {/* 🔸 Serviciu */}
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#d4af37] hover:border-[#d4af37] transition text-base"
            required
          >
            <option value="">— selectează serviciul —</option>
            <option value="Tuns">Tuns</option>
            <option value="Tuns + Barbă">Tuns + Barbă</option>
            <option value="Barbă">Barbă</option>
            <option value="Spălat + Coafat">Spălat + Coafat</option>
          </select>

          {/* 🔸 Barber */}
          <div className="relative flex items-center">
            <select
              name="barber_id"
              value={form.barber_id}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 text-gray-200 focus:border-[#d4af37] transition text-base appearance-none"
              required
            >
              <option value="">— selectează frizerul —</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  ✂️ {b.nume} — {b.specializare}
                </option>
              ))}
            </select>
            <Scissors className="absolute right-3 text-[#d4af37] w-5 h-5 pointer-events-none" />
          </div>

          {/* 🔸 Data + Ora */}
          <div className="flex gap-3 items-center justify-between">
            <div className="relative flex-1 flex items-center group">
              <input
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                disabled={isHoliday}
                className={`w-full bg-gradient-to-br from-[#111] to-[#1f1f1f] border rounded-md px-4 py-2 pr-10 text-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition text-base ${
                  isHoliday
                    ? "border-red-500 text-red-400 cursor-not-allowed"
                    : "border-[#d4af37]/50"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => dateRef.current.showPicker()}
                disabled={isHoliday}
                className={`absolute right-3 ${
                  isHoliday ? "text-red-500" : "text-[#d4af37]"
                } hover:text-yellow-400 transition`}
              >
                <CalendarDays className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center">
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                disabled={isHoliday}
                className="w-full bg-[#1a1a1a] border border-[#d4af37]/40 rounded-md px-4 py-2 pr-10 text-gray-200 focus:border-[#d4af37] transition text-base appearance-none disabled:text-gray-500 disabled:cursor-not-allowed"
                required
              >
                <option value="">HH:MM</option>
                {allTimes.map((t) => {
                  const isBooked = bookedTimes.includes(t);
                  return (
                    <option
                      key={t}
                      value={t}
                      disabled={isBooked}
                      className={
                        isBooked
                          ? "text-gray-500 bg-[#111]/70 cursor-not-allowed"
                          : "text-[#d4af37]"
                      }
                    >
                      {t} {isBooked ? "(ocupat)" : ""}
                    </option>
                  );
                })}
              </select>
              <Clock className="absolute right-3 text-[#d4af37] w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {isHoliday && (
            <p className="text-red-400 text-sm text-center mt-2">
              Frizerul este în concediu în această zi. Alege altă dată.
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isHoliday}
            className={`w-full mt-4 font-semibold py-3 rounded-md border transition ${
              isHoliday
                ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                : "bg-[#d4af37] text-black hover:bg-transparent hover:text-[#d4af37] border-[#d4af37]"
            }`}
          >
            {isHoliday ? "Zile libere" : "Programează-te acum"}
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("succes") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
