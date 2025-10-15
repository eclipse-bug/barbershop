import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔁 Ascultă și actualizează utilizatorul fără refresh
  useEffect(() => {
    const syncUser = () => {
      const savedUser =
        JSON.parse(localStorage.getItem("loggedUser")) ||
        JSON.parse(sessionStorage.getItem("loggedUser"));
      setCurrentUser(savedUser);
    };

    // Prima încărcare
    syncUser();

    // Ascultă modificările din aplicație și localStorage
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
    alert("Te-ai delogat cu succes!");
    navigate("/login");
  };

  // 👑 Determină dacă este admin
  const isAdmin =
    currentUser &&
    (
      currentUser.telefon === "+37360000000" ||
      currentUser.telefon === "076784211" ||
      currentUser.prenume?.toLowerCase() === "denis"
    );

  // 🔗 Link-uri de navigare
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
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-semibold text-[#d4af37] tracking-wide cursor-pointer select-none"
        >
          Denis <span className="text-white">Barbershop</span>
        </h1>

        {/* Meniu Desktop */}
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

        {/* Dreapta: user / login */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[#d4af37] font-medium">
                  Salut,{" "}
                  <NavLink
                    to="/profile"
                    className="underline-offset-4 hover:underline"
                  >
                    {currentUser.prenume}
                  </NavLink>
                  !
                </span>

                {currentUser?.isAdmin && (
  <motion.span
    whileHover={{ scale: 1.1 }}
    className="text-xs bg-[#d4af37] text-black font-semibold px-2 py-[2px] rounded-full uppercase tracking-wide"
  >
    Admin {currentUser.prenume}
  </motion.span>
)}

              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-gray-300 hover:text-[#d4af37] transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
              >
                Register
              </NavLink>
            </>
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

      {/* Meniu mobil animat */}
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

            {/* 🔑 User (mobil) */}
            <div className="pt-4 border-t border-[#d4af37]/20">
              {currentUser ? (
                <>
                  <p className="text-[#d4af37] font-medium mb-2">
                    {currentUser.prenume} {isAdmin && "(Admin)"}
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
                <div className="flex flex-col items-center gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-[#d4af37] transition"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-md border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
