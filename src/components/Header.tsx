import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, Code, Gamepad2, Trophy, Settings } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/python", label: "Python", icon: Code },
  ];

  return (
    <header className="bg-gradient-dark text-white shadow-neon sticky top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <img 
              src="/favicon.ico" 
              alt="Logo" 
              className="w-10 h-10" 
            />
            <div>
              <h1 className="text-2xl font-bold">
                CIn<span className="text-primary-glow">troduza</span>
              </h1>
              <p className="text-xs text-gray-300">Gaming Edition</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive 
                      ? "bg-primary text-white shadow-glow" 
                      : "text-gray-300 hover:text-white hover:bg-primary/20"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ...removido stats... */}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;