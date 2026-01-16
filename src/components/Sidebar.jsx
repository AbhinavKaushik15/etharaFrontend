import { LayoutDashboard, CalendarCheck, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Employees', icon: Users, path: '/employees' },
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 glass-card text-[var(--text-primary)] rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-[var(--border-color)]"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--bg-secondary)] text-[var(--text-primary)] flex flex-col p-6 shadow-2xl border-r border-[var(--border-color)] transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="mb-12 group text-center">
          <h1 className="text-3xl font-extrabold tracking-wide group-hover:scale-105 transition-transform duration-200">
            ethara<span className="text-[var(--accent-purple-light)]">.ai</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Admin Panel</p>
        </div>

        {/* Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menus.map(({ name, icon: Icon, path }) => {
              const active = isActive(path);
              return (
                <li key={name}>
                  <button
                    onClick={() => handleNavigation(path)}
                    className={`group relative w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden
                      ${
                        active
                          ? 'bg-[var(--accent-purple)] shadow-xl shadow-[var(--accent-purple)]/30 scale-[1.02] text-white'
                          : 'hover:bg-[var(--bg-hover)] hover:scale-[1.02] text-[var(--text-secondary)]'
                      }`}
                  >
                    {/* Glow effect */}
                    <span
                      className={`absolute inset-0 bg-[var(--accent-purple-light)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                        active ? 'opacity-20' : ''
                      }`}
                    ></span>

                    {/* Active left bar */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[var(--accent-purple-light)] rounded-r-xl shadow-lg"></span>
                    )}

                    {/* Icon */}
                    <Icon
                      size={20}
                      className={`transition-all duration-300 ${
                        active
                          ? 'text-white scale-110'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-110'
                      }`}
                    />

                    {/* Text */}
                    <span className="font-semibold tracking-wide text-base relative z-10">
                      {name}
                    </span>

                    {/* Hover arrow */}
                    <span className="ml-auto text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)] font-medium text-center">
            ethara.ai © 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
