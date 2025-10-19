import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [holidays, setHolidays] = useState([]); // 🌴 adăugat pentru concedii
  const [selectedHoliday, setSelectedHoliday] = useState("");

  // 🧩 Preluăm userul logat
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("loggedUser")) ||
      JSON.parse(sessionStorage.getItem("loggedUser"));
    setUser(stored);
    if (stored) {
      fetchAppointments(stored.id);
      fetchHolidays(stored.id);
    }
  }, []);

  // 🔄 Încarcă programările
  const fetchAppointments = async (barberId) => {
    try {
      const res = await fetch(
        `http://localhost/barbershop/backend/api/get_barber_appointments.php?barber_id=${barberId}`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.appointments)) {
        const sorted = data.appointments.sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
        );
        setAppointments(sorted);
      } else setAppointments([]);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  // 🔁 Încarcă zilele libere din DB
  const fetchHolidays = async (barberId) => {
    try {
      const res = await fetch(
        `http://localhost/barbershop/backend/api/get_holidays.php?barber_id=${barberId}`
      );
      const data = await res.json();
      if (data.success) setHolidays(data.holidays);
    } catch (err) {
      console.error("Eroare holidays:", err);
    }
  };

  // 🧩 Începem editarea
  const handleEdit = (appt) => {
    setEditingId(appt.id);
    setEdited({ date: appt.date, time: appt.time });
  };

  // 💾 Salvăm modificările
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
        if (user) fetchAppointments(user.id);
      } else setMessage("⚠ Eroare la actualizare!");
    } catch (err) {
      console.error(err);
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🗑️ Ștergere programare
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi această programare?")) return;

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
        setMessage("🗑️ Programarea a fost ștearsă!");
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } else setMessage("⚠ Eroare la ștergere!");
    } catch (err) {
      console.error("Eroare conexiune:", err);
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🌴 Adaugă zi liberă
  const handleAddHoliday = async () => {
    if (!selectedHoliday) {
      setMessage("⚠ Selectează o dată pentru concediu!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/set_holiday.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barber_id: user.id, date: selectedHoliday }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("🌴 Ziua liberă a fost adăugată!");
        fetchHolidays(user.id);
      } else {
        setMessage(data.error || "⚠ Eroare la salvare!");
      }
    } catch (err) {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🗑️ Șterge o zi liberă
  const handleDeleteHoliday = async (date) => {
    if (!window.confirm("Ștergi această zi liberă?")) return;
    try {
      const res = await fetch(
        "http://localhost/barbershop/backend/api/delete_holiday.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barber_id: user.id, date }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("🗓️ Ziua liberă a fost eliminată!");
        fetchHolidays(user.id);
      } else {
        setMessage("⚠ Eroare la ștergere!");
      }
    } catch (err) {
      setMessage("⚠ Eroare de conexiune!");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🔍 Filtrare avansată
// 🔍 Filtrare avansată și tolerantă
const filteredAppointments = appointments.filter((a) => {
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/\s+/g, "") // elimină spațiile
      .trim();

  const term = normalize(search);
  const clientName = normalize(a.client_nume);
  const phone = normalize(a.client_telefon);
  const service = normalize(a.service);
  const barber = normalize(a.barber_name);

  return (
    clientName.includes(term) ||
    phone.includes(term) ||
    service.includes(term) ||
    barber.includes(term)
  );
});


  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-black/40 border border-[#d4af37]/40 rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-[#d4af37] mb-4 text-center">
          Dashboard — {user?.prenume || "Barber"}
        </h1>

        {/* 🌴 Zile libere / Concediu */}
        <div className="mb-8 bg-[#1a1a1a]/50 border border-[#d4af37]/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-[#d4af37] mb-3 text-center">
            Zile libere / Concediu
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="date"
              value={selectedHoliday}
              onChange={(e) => setSelectedHoliday(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-[#111] border border-[#d4af37]/50 rounded-md px-3 py-2 text-[#d4af37] focus:border-[#d4af37] focus:outline-none"
            />
            <button
              onClick={handleAddHoliday}
              className="bg-[#d4af37] text-black font-semibold px-5 py-2 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition"
            >
              Salvează concediul
            </button>
          </div>

          {holidays.length > 0 && (
            <ul className="mt-4 text-center text-sm text-gray-300">
              {holidays.map((h, i) => (
                <li key={i} className="mb-2">
                  {h.date}{" "}
                  <button
                    onClick={() => handleDeleteHoliday(h.date)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Șterge
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔍 Bara de căutare */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Caută client după nume, prenume sau telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-[#1a1a1a] border border-[#d4af37]/40 text-[#d4af37] placeholder-gray-500 rounded-md px-4 py-2 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mb-4 font-medium ${
              message.includes("✅") ||
              message.includes("🗑️") ||
              message.includes("🌴")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </motion.p>
        )}

        {/* 📅 Tabel programări */}
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-400">
            Niciun rezultat găsit pentru termenul introdus.
          </p>
        ) : (
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#1a1a1a] text-[#d4af37] sticky top-0">
                <tr>
                  <th className="p-3 border border-[#d4af37]/30">#</th>
                  <th className="p-3 border border-[#d4af37]/30">Client</th>
                  <th className="p-3 border border-[#d4af37]/30">Telefon</th>
                  <th className="p-3 border border-[#d4af37]/30">Serviciu</th>
                  <th className="p-3 border border-[#d4af37]/30">Data</th>
                  <th className="p-3 border border-[#d4af37]/30">Ora</th>
                  <th className="p-3 border border-[#d4af37]/30">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((a, i) => (
                  <tr
                    key={a.id}
                    className="hover:bg-[#d4af37]/10 transition text-center"
                  >
                    <td className="p-2 border border-[#d4af37]/20">{i + 1}</td>
                    <td className="p-2 border border-[#d4af37]/20">
                      {a.client_prenume} {a.client_nume}
                    </td>
                    <td className="p-2 border border-[#d4af37]/20">
                      {a.client_telefon}
                    </td>
                    <td className="p-2 border border-[#d4af37]/20">
                      {a.service}
                    </td>
                    <td className="p-2 border border-[#d4af37]/20">
                      {editingId === a.id ? (
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={edited.date}
                          onChange={(e) =>
                            setEdited((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="bg-[#111] border border-[#d4af37]/50 rounded-md px-2 py-1 text-[#d4af37]"
                        />
                      ) : (
                        <span className="text-gray-200">{a.date}</span>
                      )}
                    </td>
                    <td className="p-2 border border-[#d4af37]/20">
                      {editingId === a.id ? (
                        <input
                          type="time"
                          value={edited.time}
                          onChange={(e) =>
                            setEdited((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                          className="bg-[#111] border border-[#d4af37]/50 rounded-md px-2 py-1 text-[#d4af37]"
                        />
                      ) : (
                        <span className="text-gray-200">{a.time}</span>
                      )}
                    </td>
                    <td className="p-2 border border-[#d4af37]/20 flex justify-center gap-2">
                      {editingId === a.id ? (
                        <button
                          onClick={() => handleSave(a.id)}
                          className="bg-[#d4af37] text-black px-3 py-1 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37]"
                        >
                          Salvează
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(a)}
                            className="text-[#d4af37] hover:underline"
                          >
                            Editează
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="text-red-500 hover:underline"
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
      </motion.div>
    </section>
  );
}
