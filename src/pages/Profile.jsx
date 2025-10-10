import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({ nume: "", prenume: "", telefon: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!storedUser) {
      alert("Trebuie să fii autentificat pentru a accesa profilul.");
      navigate("/login");
    } else {
      setUser(storedUser);
      setEditData(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // actualizăm utilizatorul logat
    localStorage.setItem("loggedUser", JSON.stringify(editData));

    // actualizăm și în lista completă de utilizatori
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.map((u) =>
      u.telefon === user.telefon ? editData : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(editData);
    alert("Profilul a fost actualizat cu succes!");
  };

  if (!user) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-10 w-full max-w-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-[#d4af37] mb-6">
          Profilul meu
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nume (Familie)</label>
            <input
              type="text"
              name="nume"
              value={editData.nume}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#d4af37]/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Prenume (Nume mic)</label>
            <input
              type="text"
              name="prenume"
              value={editData.prenume}
              onChange={handleChange}
              className="w-full bg-transparent border border-[#d4af37]/30 text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#d4af37] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Număr de telefon</label>
            <input
              type="tel"
              name="telefon"
              value={editData.telefon}
              onChange={handleChange}
              disabled
              className="w-full bg-transparent border border-[#d4af37]/30 text-gray-400 rounded-md px-4 py-2 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Numărul de telefon nu poate fi modificat.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-4 bg-[#d4af37] text-black font-semibold py-3 rounded-md hover:bg-transparent hover:text-[#d4af37] border border-[#d4af37] transition duration-300"
          >
            Salvează modificările
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
