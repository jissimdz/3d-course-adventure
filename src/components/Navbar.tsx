
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/daa9d145-aa5f-46a1-92fd-190850071af1.png"
            alt="Erudis Logo"
            className="h-15 w-15"
          />
          <span className="text-xl font-bold text-brand-blue">Erudis</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="font-medium text-gray-700 hover:text-brand-blue">
            Accueil
          </Link>
          <Link to="/courses" className="font-medium text-gray-700 hover:text-brand-blue">
            Cours
          </Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-brand-blue">
            À Propos
          </Link>
          <Button variant="default" className="ml-2 bg-brand-blue hover:bg-brand-blue/90">
            Commencer
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white py-2 md:hidden">
          <div className="container mx-auto space-y-2 px-4">
            <Link
              to="/"
              className="block py-2 font-medium text-gray-700 hover:text-brand-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/courses"
              className="block py-2 font-medium text-gray-700 hover:text-brand-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Cours
            </Link>
            <Link
              to="/about"
              className="block py-2 font-medium text-gray-700 hover:text-brand-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              À Propos
            </Link>
            <Button
              variant="default"
              className="mt-2 w-full bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => setIsMenuOpen(false)}
            >
              Commencer
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
