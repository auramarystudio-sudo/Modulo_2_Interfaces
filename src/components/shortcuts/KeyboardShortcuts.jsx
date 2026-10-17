import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar si estamos en un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // Ctrl+K - Ayuda de atajos
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }

      // Ctrl+1-5 - Navegación entre módulos
      if (e.ctrlKey && e.key === '1') { e.preventDefault(); navigate('/'); }
      if (e.ctrlKey && e.key === '2') { e.preventDefault(); navigate('/interfaces'); }
      if (e.ctrlKey && e.key === '3') { e.preventDefault(); navigate('/servidores'); }
      if (e.ctrlKey && e.key === '4') { e.preventDefault(); navigate('/lanzadores'); }
      if (e.ctrlKey && e.key === '5') { e.preventDefault(); navigate('/sesiones'); }

      // Ctrl+Shift+M - Monitor
      if (e.ctrlKey && e.shiftKey && e.key === 'M') { e.preventDefault(); navigate('/monitor'); }

      // Ctrl+Shift+T - Probador de APIs
      if (e.ctrlKey && e.shiftKey && e.key === 'T') { e.preventDefault(); navigate('/api-tester'); }

      // Ctrl+Shift+D - Docker Builder
      if (e.ctrlKey && e.shiftKey && e.key === 'D') { e.preventDefault(); navigate('/docker-builder'); }

      // Escape - Cerrar modales
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const shortcuts = [
    { keys: 'Ctrl + K', description: 'Mostrar/ocultar ayuda', category: 'General' },
    { keys: 'Ctrl + 1', description: 'Ir a Inicio', category: 'Navegación' },
    { keys: 'Ctrl + 2', description: 'Ir a Interfaces', category: 'Navegación' },
    { keys: 'Ctrl + 3', description: 'Ir a Servidores', category: 'Navegación' },
    { keys: 'Ctrl + 4', description: 'Ir a Lanzadores', category: 'Navegación' },
    { keys: 'Ctrl + 5', description: 'Ir a Sesiones', category: 'Navegación' },
    { keys: 'Ctrl + Shift + M', description: 'Monitor del Sistema', category: 'Herramientas' },
    { keys: 'Ctrl + Shift + T', description: 'Probador de APIs', category: 'Herramientas' },
    { keys: 'Ctrl + Shift + D', description: 'Generador Docker', category: 'Herramientas' },
    { keys: 'Escape', description: 'Cerrar modales', category: 'General' },
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <>
      {/* Botón flotante de ayuda */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-white shadow-lg backdrop-blur-sm transition-all z-40 flex items-center justify-center group"
        title="Atajos de teclado (Ctrl+K)"
      >
        <Keyboard size={20} />
      </button>

      {/* Modal de ayuda */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                  <Keyboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Atajos de Teclado</h3>
                  <p className="text-xs text-slate-500">Navega más rápido</p>
                </div>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {categories.map(category => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                  <div className="space-y-1">
                    {shortcuts.filter(s => s.category === category).map((shortcut, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-800/30 transition">
                        <span className="text-sm text-slate-300">{shortcut.description}</span>
                        <kbd className="text-xs bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-slate-300 font-mono">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
