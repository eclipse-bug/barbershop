import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [forcedBarberId, setForcedBarberId] = useState(null);

  const activeBarberId = forcedBarberId || user?.id || null;

  // --- Obținerea programărilor ---
  const fetchAppointments = async (barberId) => {
    if (!barberId) return setAppointments([]);
    try {
      const res = await fetch(
        `http://localhost/barbershop/backend/api/get_barber_appointments.php?barber_id=${encodeURIComponent(
          barberId
        )}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data?.success && Array.isArray(data.appointments)) {
        const sorted = data.appointments.sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
        );
        setAppointments(sorted);
      } else setAppointments([]);
    } catch {
      setAppointments([]);
    }
  };

  // --- Obținerea zilelor libere ---
  const fetchHolidays = async (barberId) => {
    if (!barberId) return setHolidays([]);
    try {
      const res = await fetch(
        `http://localhost/barbershop/backend/api/get_holidays.php?barber_id=${encodeURIComponent(
          barberId
        )}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data?.success)
        setHolidays(
          data.holidays
            .map((h) => (typeof h === "string" ? h : h?.date || null))
            .filter(Boolean)
        );
      else setHolidays([]);
    } catch {
      setHolidays([]);
    }
  };

  // --- Inițializare utilizator ---
  useEffect(() => {
    const raw =
      localStorage.getItem("loggedUser") || sessionStorage.getItem("loggedUser");
    let stored = null;
    try {
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }

    if (!stored) return;

    setUser(stored);
    const phoneNormalized = (stored.telefon || "").replace(/\D/g, "");

    if (phoneNormalized === "060000000") {
      setForcedBarberId(1);
      fetchAppointments(1);
      fetchHolidays(1);
    } else if (phoneNormalized === "076784211") {
      setForcedBarberId(2);
      fetchAppointments(2);
      fetchHolidays(2);
    } else if (stored.id) {
      fetchAppointments(stored.id);
      fetchHolidays(stored.id);
    }
  }, []);

  // --- Adăugare zi liberă ---
  const handleAddHoliday = async () => {
    if (!selectedHoliday) return setMessage("⚠ Selectează o dată din calendar!");
    if (!activeBarberId) return setMessage("⚠ Barber inexistent pentru salvare!");

    const year = selectedHoliday.getFullYear();
    const month = String(selectedHoliday.getMonth() + 1).padStart(2, "0");
    const day = String(selectedHoliday.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/set_holiday.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barber_id: activeBarberId, date: dateStr }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("🌴 Ziua liberă a fost adăugată corect!");
        fetchHolidays(activeBarberId);
        setSelectedHoliday(null);
      } else setMessage(data.message || "⚠ Eroare la salvare!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Ștergere zi liberă ---
  const handleDeleteHoliday = async (date) => {
    if (!activeBarberId) return setMessage("⚠ Barber inexistent pentru ștergere!");
    if (!window.confirm("Ștergi această zi liberă?")) return;
    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/delete_holiday.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barber_id: activeBarberId, date }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("🗓️ Ziua liberă a fost eliminată!");
        fetchHolidays(activeBarberId);
      } else setMessage("⚠ Eroare la ștergere!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Editare / Salvare programare ---
  const handleEdit = (appt) => {
    setEditingId(appt.id);
    setEdited({ date: appt.date, time: appt.time });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/update_appointment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, date: edited.date, time: edited.time }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Programarea a fost actualizată!");
        setEditingId(null);
        fetchAppointments(activeBarberId);
      } else setMessage("⚠ Eroare la actualizare!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Ștergere programare ---
  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această programare?")) return;
    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/delete_appointment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setMessage("🗑️ Programarea a fost ștearsă!");
      } else setMessage("⚠ Eroare la ștergere!");
    } catch {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- Filtrare ---
  const filteredAppointments = appointments.filter((a) => {
    const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, "").trim();
    const term = normalize(search);
    const match =
      normalize(a.client_nume || a.nume || "").includes(term) ||
      normalize(a.client_telefon || a.telefon || "").includes(term) ||
      normalize(a.service || "").includes(term);
    if (filterDate) {
      const year = filterDate.getFullYear();
      const month = String(filterDate.getMonth() + 1).padStart(2, "0");
      const day = String(filterDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      return a.date === dateStr && match;
    }
    return match;
  });

  if (!user?.id)
    return (
      <section className="bg-[#0f0f0f] text-white p-6 flex justify-center items-center min-h-[60vh]">
        <p className="text-center text-red-400 text-sm sm:text-base">
          Nu ești autentificat. Te rog să te reconectezi pentru a accesa panoul.
        </p>
      </section>
    );

  return (
    <section className="text-white px-3 py-6 md:px-6 lg:px-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl bg-black/40 border border-[#d4af37]/40 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-hidden pb-28"
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#d4af37] mb-6 text-center">
          Dashboard — {user?.prenume || "Frizer"}
        </h1>

        {/* 🌴 Zile libere / Concediu */}
        <div className="mb-8 bg-[#1a1a1a]/60 border border-[#d4af37]/30 rounded-xl p-4 md:p-6 text-center">
          <h2 className="text-lg md:text-xl font-semibold text-[#d4af37] mb-4">
            Zile libere / Concediu
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 w-full  z-50">
            <div className="relative w-full sm:w-auto flex items-center justify-center" >
              <DatePicker
                selected={selectedHoliday}
                onChange={(date) => setSelectedHoliday(date)}
                locale="ro"
                dateFormat="dd.MM.yyyy"
                minDate={new Date()}
                placeholderText="Alege o dată..."
                className="w-full bg-[#0f0f0f] border border-[#d4af37]/60 rounded-lg px-4 py-2 md:px-5 md:py-3 text-[#d4af37] text-center leading-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm md:text-base placeholder-gray-500"
                popperPlacement="top"
                popperClassName="z-[9999]" 
              />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5 pointer-events-none" />
            </div>

            <button
              onClick={handleAddHoliday}
              className="w-full md:w-auto bg-[#d4af37] text-black font-semibold px-5 md:px-6 py-2 md:py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300 shadow-md text-sm md:text-base"
            >
              Salvează concediul
            </button>
          </div>

          {holidays.length > 0 && (
            <ul className="mt-5 text-center text-xs md:text-sm text-gray-300 flex flex-wrap justify-center gap-2 md:gap-3">
              {holidays.map((h, i) => (
                <li
                  key={i}
                  className="bg-[#222]/60 px-3 py-1.5 rounded-md flex items-center gap-2 border border-[#d4af37]/20"
                >
                  <span className="text-[#d4af37]">{h}</span>
                  <button
                    onClick={() => handleDeleteHoliday(h)}
                    className="text-red-400 hover:text-red-500 text-base leading-none"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔍 Căutare + Filtru Dată */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 w-full text-center">
          <input
            type="text"
            placeholder="Caută client, serviciu sau telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-[#1a1a1a] border border-[#d4af37]/40 text-[#d4af37] placeholder-gray-500 rounded-md px-4 py-2 text-center leading-none text-sm md:text-base focus:border-[#d4af37] focus:outline-none"
          />

          <div className="relative w-full sm:w-auto flex items-center justify-center">
            <DatePicker
              selected={filterDate}
              onChange={(date) => setFilterDate(date)}
              locale="ro"
              dateFormat="dd.MM.yyyy"
              placeholderText="Filtrează după dată..."
              className="w-full bg-[#0f0f0f] border border-[#d4af37]/60 rounded-lg px-4 py-2 md:px-5 md:py-3 text-[#d4af37] text-center leading-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 text-sm md:text-base placeholder-gray-500"
              popperPlacement="top-end"
              
            />
            <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] w-5 h-5 pointer-events-none" />
            {filterDate && (
              <button
                onClick={() => setFilterDate(null)}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 📅 Lista programărilor */}
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm md:text-base mb-10">
            Nu s-au găsit programări pentru filtrul selectat.
          </p>
        ) : (
          <div className="overflow-y-auto max-h-[65vh] rounded-lg border border-[#d4af37]/30 shadow-inner mb-10">
            <table className="w-full text-[11px] sm:text-sm md:text-base border-collapse">
              <thead className="bg-[#1a1a1a] text-[#d4af37] sticky top-0 z-10">
                <tr>
                  <th className="p-2 md:p-4">#</th>
                  <th className="p-2 md:p-4">Client</th>
                  <th className="p-2 md:p-4">Telefon</th>
                  <th className="p-2 md:p-4">Serviciu</th>
                  <th className="p-2 md:p-4">Data</th>
                  <th className="p-2 md:p-4">Ora</th>
                  <th className="p-2 md:p-4">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((a, i) => (
                  <tr key={a.id} className="hover:bg-[#d4af37]/10 transition text-center">
                    <td className="p-2 md:p-4">{i + 1}</td>
                    <td className="p-2 md:p-4">
                      {a.client_prenume} {a.client_nume}
                    </td>
                    <td className="p-2 md:p-4">{a.client_telefon}</td>
                    <td className="p-2 md:p-4">{a.service}</td>
                    <td className="p-2 md:p-4">
                      {editingId === a.id ? (
                        <input
                          type="date"
                          value={edited.date}
                          onChange={(e) => setEdited({ ...edited, date: e.target.value })}
                          className="bg-[#111] border border-[#d4af37]/40 text-[#d4af37] rounded px-2 py-1 text-sm w-[110px]"
                        />
                      ) : (
                        a.date
                      )}
                    </td>
                    <td className="p-2 md:p-4">
                      {editingId === a.id ? (
                        <input
                          type="time"
                          value={edited.time}
                          onChange={(e) => setEdited({ ...edited, time: e.target.value })}
                          className="bg-[#111] border border-[#d4af37]/40 text-[#d4af37] rounded px-2 py-1 text-sm w-[90px]"
                        />
                      ) : (
                        a.time
                      )}
                    </td>
                    <td className="p-2 md:p-4 flex flex-col md:flex-row justify-center gap-2">
                      {editingId === a.id ? (
                        <>
                          <button
                            onClick={() => handleSave(a.id)}
                            className="text-green-400 hover:underline text-sm"
                          >
                            Salvează
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:underline text-sm"
                          >
                            Anulează
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(a)}
                            className="text-[#d4af37] hover:underline text-sm"
                          >
                            Editează
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Șterge
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <p className="text-center text-sm mt-2 text-[#d4af37]">{message}</p>
        )}
      </motion.div>
    </section>
  );
}
