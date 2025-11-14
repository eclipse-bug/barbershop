import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [telefon, setTelefon] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser =
      localStorage.getItem("loggedUser") || sessionStorage.getItem("loggedUser");

    if (!rawUser || rawUser === "undefined" || rawUser === "null") return;

    try {
      const savedUser = JSON.parse(rawUser);
      if (savedUser?.isAdmin) navigate("/dashboard");
    } catch {
      console.warn("Date invalide în localStorage/sessionStorage");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!telefon.trim() || !adminCode.trim()) {
      setError("Completează toate câmpurile!");
      return;
    }

    try {
      const response = await fetch("http://localhost/barbershop/backend/api/verify_admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefon, adminCode }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("loggedUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Eroare de conexiune cu serverul!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-10 w-full max-w-md shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Autentificare Admin
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Număr de telefon
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="+37360000000"
              className="w-full bg-transparent border border-[#d4af37]/30 focus:border-[#d4af37] text-white rounded-md px-4 py-2 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Cod de acces
            </label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Introdu codul secret"
              className="w-full bg-transparent border border-[#d4af37]/30 focus:border-[#d4af37] text-white rounded-md px-4 py-2 focus:outline-none transition"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-5 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Autentifică-te
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-8">
          Accesul este permis doar administratorilor înregistrați.
        </p>
      </motion.div>
    </section>
  );
}
