import { Link, useLocation } from 'react-router-dom';
import { Home, Monitor, Globe, Zap, Layers, Terminal } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navLinks = [
    { to: '/', icon: Home, label: 'Inicio', color: 'cyan' },
    { to: '/interfaces', icon: Monitor, label: 'Interfaces', color: 'cyan' },
    { to: '/servidores', icon: Globe, label: 'Servidores', color: 'purple' },
    { to: '/lanzadores', icon: Terminal, label: 'Lanzadores', color: 'green' },
    { to: '/sesiones', icon: Layers, label: 'Sesiones', color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/20 transition"><Zap className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Local Manager</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Gestor de Herramientas de IA</p>
              </div>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = isActive(link.to);
                const colorClasses = {
                  cyan: active ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-cyan-500/5' : '',
                  purple: active ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-purple-500/5' : '',
                  green: active ? 'bg-green-500/10 text-green-300 border-green-500/30 shadow-green-500/5' : '',
                  amber: active ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-amber-500/5' : '',
                };
                return (
                  <Link key={link.to} to={link.to} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${active ? `${colorClasses[link.color]} shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent'}`}>
                    <Icon className="w-4 h-4" /><span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm py-4">
        <div className="max-w-[1800px] mx-auto px-6"><p className="text-center text-xs text-slate-500">AI Local Manager — Gestiona tus herramientas de IA en red local</p></div>
      </footer>
    </div>
  );
}
