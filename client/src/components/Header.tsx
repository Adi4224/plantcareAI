import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", current: location === "/" },
    { name: "Analysis", href: "/analysis", current: location === "/analysis" },
    { name: "History", href: "/history", current: location === "/history" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 text-2xl">🌱</div>
            <h1 className="text-xl font-bold text-primary">Smart Garden</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  item.current
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              data-testid="button-theme-toggle"
              className="flex items-center gap-2"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Light</span>
                </>
              )}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    item.current
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
