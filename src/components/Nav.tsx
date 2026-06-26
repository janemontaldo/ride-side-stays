import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronsUp } from 'lucide-react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const transparent = isHome && !scrolled && !open;

  const linkClass = (isActive: boolean) =>
    `text-nav font-medium transition-colors duration-200 ${
      transparent
        ? isActive ? 'text-white' : 'text-white/80 hover:text-white'
        : isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 backdrop-blur-md ${
        transparent
          ? 'bg-black/20 border-b border-white/10'
          : 'bg-cream/95 border-b border-cream-400/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[60px] lg:h-[72px]">

          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2.5 font-semibold text-nav-lg tracking-tight transition-colors duration-200 ${
              transparent ? 'text-white' : 'text-ink'
            }`}
          >
            <ChevronsUp
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                transparent ? 'text-white' : 'text-ink'
              }`}
              strokeWidth={2.5}
            />
            Ride Side Stays
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/about" end className={({ isActive }) => linkClass(isActive)}>
              About
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => linkClass(isActive)}>
              Properties
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => linkClass(isActive)}>
              Contact
            </NavLink>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 -mr-1 rounded-lg transition-colors ${
              transparent ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-cream-300'
            }`}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-cream border-t border-cream-400/60">
          <nav className="px-5 py-5 space-y-1">
            {[
              { to: '/about', label: 'About', end: true },
              { to: '/properties', label: 'Properties', end: false },
              { to: '/contact', label: 'Contact', end: false },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-ink bg-cream-300' : 'text-ink-muted hover:text-ink hover:bg-cream-300'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
