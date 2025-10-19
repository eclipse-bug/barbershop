import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔁 Ascultă userul din local/session storage
  useEffect(() => {
    const syncUser = () => {
      const savedUser =
        JSON.parse(localStorage.getItem("loggedUser")) ||
        JSON.parse(sessionStorage.getItem("loggedUser"));
      setCurrentUser(savedUser);
    };

    syncUser();
    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // 🔒 Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    sessionStorage.removeItem("loggedUser");
    setCurrentUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  // 👑 Verificăm dacă e admin
  const isAdmin =
    currentUser &&
    (
      currentUser.telefon === "+37360000000" ||
      currentUser.telefon === "076784211" ||
      currentUser.prenume?.toLowerCase() === "denis"
    );

  // 🔗 Link-uri publice
  const navigationLinks = [
    { to: "/", label: "Acasă" },
    { to: "/services", label: "Servicii" },
    { to: "/barbers", label: "Barberi" },
    { to: "/booking", label: "Programări" },
    { to: "/about", label: "Despre noi" },
    { to: "/contact", label: "Contact" },
  ];

  if (isAdmin) {
    navigationLinks.push({ to: "/dashboard", label: "Dashboard" });
  }

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md bg-black/70 border-b border-[#d4af37]/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
        {/* 🔹 Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-semibold text-[#d4af37] tracking-wide cursor-pointer select-none"
        >
          Denis <span className="text-white">Barbershop</span>
        </h1>

        {/* 🔹 Meniu Desktop */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-[#d4af37]"
                  : "text-gray-300 hover:text-[#d4af37] transition"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* 🔹 Dreapta: doar admin login / dashboard */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin ? (
            <>
              <span className="text-[#d4af37] font-medium">
                Salut, {currentUser?.prenume || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* 🔽 Meniu mobil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#d4af37] focus:outline-none"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 🔹 Meniu mobil animat */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-lg border-t border-[#d4af37]/30 text-center py-4 space-y-4"
          >
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-[#d4af37] font-semibold"
                    : "block text-gray-300 hover:text-[#d4af37] transition"
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* 🔑 Zona de login/logout pe mobil */}
            <div className="pt-4 border-t border-[#d4af37]/20">
              {isAdmin ? (
                <>
                  <p className="text-[#d4af37] font-medium mb-2">
                    {currentUser?.prenume || "Admin"}
                  </p>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
                >
                  Admin Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
