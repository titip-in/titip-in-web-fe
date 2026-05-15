import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Beranda", path: "/", icon: "🏠" },
  { name: "Jastip", path: "/jastip/listings", icon: "📦" },
  { name: "Preloved", path: "/preloved/listings", icon: "🛍️" },
  { name: "Profil", path: "/profile", icon: "👤" },
];

export function BottomNav() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`bottom-nav ${isVisible ? "visible" : ""}`} id="bottom-nav">
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item${isActive ? " active" : ""}`}
            aria-label={item.name}
          >
            <span className="text-[20px] mb-[2px]">{item.icon}</span>
            <span className="bottom-nav-label">{item.name}</span>
            {isActive && <span className="bottom-nav-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
