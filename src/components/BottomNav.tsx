import { Home, Quote, BookOpen, User, Gift } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Quote, label: "Motivation", to: "/motivation" },
  { icon: BookOpen, label: "Journal", to: "/journal" },
  { icon: Gift, label: "Rewards", to: "/rewards" },
  { icon: User, label: "Profile", to: "/profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16 safe-area-inset-bottom">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`
            }
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};