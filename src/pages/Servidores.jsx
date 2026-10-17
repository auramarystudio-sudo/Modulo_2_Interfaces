import { Globe, Wifi } from 'lucide-react';
import ServidoresManager from '../components/servidores/ServidoresManager.jsx';

export default function Servidores() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20"><Globe className="w-6 h-6 text-white" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Servidores y Chatboxes en Red Local</h1>
            <p className="text-sm text-slate-400 mt-1">Accede desde cualquier dispositivo de tu red (móvil, tablet, portátil) a Ollama, SillyTavern, etc.</p>
          </div>
        </div>
        <button onClick={() => { const event = new CustomEvent('open-server-form'); window.dispatchEvent(event); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 shrink-0 self-start sm:self-auto"><Wifi size={18} /><span>Registrar Servidor</span></button>
      </div>
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🤖 Ollama</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">💬 SillyTavern</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🦎 KoboldCpp</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">📝 Text-Generation-WebUI</span>
          <span className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50">🎨 SD Server (--listen)</span>
        </div>
      </div>
      <ServidoresManager />
    </div>
  );
}
