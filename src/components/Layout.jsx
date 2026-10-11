// Layout principal con navegación
import { Link, useLocation } from 'react-router-dom';
import { Home, Monitor, Globe, Zap } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  // Determinar enlace activo
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Barra de navegación */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-cyan-600/20 rounded-lg border border-cyan-600/30 group-hover:bg-cyan-600/30 transition-colors">
                <Zap size={20} className="text-cyan-400" />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                AI Local Manager
              </span>
            </Link>

            {/* Links de navegación */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Home size={16} />
                <span className="hidden sm:inline">Inicio</span>
              </Link>

              <Link
                to="/interfaces"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/interfaces')
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Monitor size={16} />
                <span className="hidden sm:inline">Interfaces</span>
              </Link>

              <Link
                to="/servidores"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/servidores')
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">Servidores</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm">
            AI Local Manager — Gestiona tus herramientas de IA en red local
          </p>
        </div>
      </footer>
    </div>
  );
}
