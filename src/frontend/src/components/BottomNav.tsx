import { Link, useRouterState } from "@tanstack/react-router";
import { BookMarked, Home, Upload, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/library", label: "Library", icon: BookMarked },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={`nav.${label.toLowerCase()}.link`}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
