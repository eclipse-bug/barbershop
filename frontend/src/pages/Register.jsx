import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(true); // implicit: ține-mă minte
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nume.trim() || !prenume.trim() || !telefon.trim()) {
      setMessage("Completează toate câmpurile!");
      return;
    }

    const formData = new FormData();
    formData.append("nume", nume);
    formData.append("prenume", prenume);
    formData.append("telefon", telefon);

    try {
      const res = await fetch(
        "http://localhost/barbershop/frontend/backend/api/register_client.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ Salvăm automat userul ca logat
        const newUser = { nume, prenume, telefon };

        if (remember) {
          localStorage.setItem("loggedUser", JSON.stringify(newUser));
        } else {
          sessionStorage.setItem("loggedUser", JSON.stringify(newUser));
        }

        window.dispatchEvent(new Event("userUpdated")); // pentru Navbar

        setMessage("Cont creat cu succes! Autentificare automată...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.error || "A apărut o eroare la înregistrare.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Eroare la conexiunea cu serverul.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-10 w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Înregistrare Client
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* NUME */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nume</label>
            <input
              type="text"
              value={nume}
              onChange={(e) => {
                setNume(e.target.value);
                setMessage("");
              }}
              placeholder="Ex: Balan"
              className="w-full bg-transparent border border-[#d4af37]/30 focus:border-[#d4af37] text-white rounded-md px-4 py-2 focus:outline-none transition"
            />
          </div>

          {/* PRENUME */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Prenume</label>
            <input
              type="text"
              value={prenume}
              onChange={(e) => {
                setPrenume(e.target.value);
                setMessage("");
              }}
              placeholder="Ex: Daniel"
              className="w-full bg-transparent border border-[#d4af37]/30 focus:border-[#d4af37] text-white rounded-md px-4 py-2 focus:outline-none transition"
            />
          </div>

          {/* TELEFON */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Număr de telefon
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => {
                setTelefon(e.target.value);
                setMessage("");
              }}
              placeholder="076784211 sau +37376784211"
              pattern="^(\+373\d{8}|0\d{8})$"
              title="Folosește formatul 076784211 sau +37376784211"
              className="w-full bg-transparent border border-[#d4af37]/30 focus:border-[#d4af37] text-white rounded-md px-4 py-2 focus:outline-none transition"
            />
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-[#d4af37] w-4 h-4"
            />
            Ține-mă minte
          </label>

          {/* BUTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-5 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Creează cont
          </motion.button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("succes")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-400 text-xs mt-8">
          © 2025 Denis Barbershop. Toate drepturile rezervate.
        </p>
      </motion.div>
    </section>
  );
}
