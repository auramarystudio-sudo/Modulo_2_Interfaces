import { Layers, Zap } from 'lucide-react';
import SessionManager from '../components/sesiones/SessionManager.jsx';

export default function Sesiones() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20"><Layers className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Sesiones y Presets</h1>
            <p className="text-sm text-slate-400 mt-1">Guarda combinaciones de servicios para activarlas con un solo clic</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5"><Zap size={16} className="text-amber-400" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">¿Qué son las Sesiones?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Las sesiones te permiten agrupar interfaces y servidores que usas juntos. Por ejemplo, una "Sesión SDXL" podría incluir AUTOMATIC1111 + Fooocus + Ollama. Activa la sesión y abre todos los servicios de golpe.</p>
          </div>
        </div>
      </div>
      <SessionManager />
    </div>
  );
}
