import { Link } from 'react-router-dom';
import { ChevronsUp } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-cream-400/60 mt-0">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="inline-flex items-center gap-2.5 font-semibold text-nav text-ink tracking-tight mb-3">
              <ChevronsUp className="w-5 h-5" strokeWidth={2.5} />
              Ride Side Stays
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed">
              Relaxed holiday accommodation in great locations across Australia and Europe.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1">Pages</p>
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm text-ink-muted hover:text-ink transition-colors">
                {label}
              </Link>
            ))}
          </div>

        </div>

        <div className="border-t border-cream-400/60 mt-10 pt-6">
          <p className="text-xs text-ink-faint">
            &copy; {new Date().getFullYear()} Ride Side Stays. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
