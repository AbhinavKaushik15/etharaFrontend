import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex bg-[var(--bg-primary)] min-h-screen transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Navbar */}
        <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] pl-20 sm:pl-24 lg:pl-6 pr-4 sm:pr-6 py-4 shadow-sm sticky top-0 z-30 backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center lg:justify-start">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-purple-light)] bg-clip-text text-transparent text-center lg:text-left">
                ethara.ai - Employee Management
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-primary)] hover:scale-110 transition-all duration-200 relative z-10"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
