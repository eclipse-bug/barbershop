import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(stored);
  }, []);

  const deleteBooking = (index) => {
    const updated = bookings.filter((_, i) => i !== index);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  // ✅ Funcție care forțează formatul MM/DD/YYYY indiferent de ce e salvat
  const fixToMMDDYYYY = (dateStr) => {
    if (!dateStr) return "";

    // dacă e deja mm/dd/yyyy
    const mmdd = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (mmdd) {
      const [_, mm, dd, yyyy] = mmdd;
      return `${mm}/${dd}/${yyyy}`;
    }

    // dacă e dd/mm/yyyy → inversăm
    const ddmm = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmm) {
      const [_, dd, mm, yyyy] = ddmm;
      return `${mm}/${dd}/${yyyy}`;
    }

    // dacă e yyyy-mm-dd → convertim manual
    const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const [_, yyyy, mm, dd] = iso;
      return `${mm}/${dd}/${yyyy}`;
    }

    // fallback - lăsăm stringul original
    return dateStr;
  };

  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white p-10">
      <h1 className="text-3xl font-bold text-center text-[#d4af37] mb-10">
        Programări — Panou Admin
      </h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 col-span-2">
            Nu există programări înregistrate.
          </p>
        ) : (
          bookings.map((b, i) => (
            <div
              key={i}
              className="bg-black/40 border border-[#d4af37]/40 p-6 rounded-xl"
            >
              <p className="text-[#d4af37] font-semibold mb-2">
                Programarea #{i + 1}
              </p>
              <p>
                <strong>Nume:</strong> {b.nume} {b.prenume}
              </p>
              <p>
                <strong>Telefon:</strong> {b.telefon}
              </p>
              <p>
                <strong>Serviciu:</strong> {b.service}
              </p>
              <p>
                <strong>Data:</strong> {fixToMMDDYYYY(b.date)}
              </p>
              <p>
                <strong>Ora:</strong> {b.time}
              </p>

              <button
                onClick={() => deleteBooking(i)}
                className="text-red-500 mt-3 hover:underline"
              >
                Șterge
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
