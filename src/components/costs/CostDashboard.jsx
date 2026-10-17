import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Plus, Trash2, BarChart3 } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', color: 'text-green-400', bg: 'bg-green-950/50', border: 'border-green-700/30' },
  { id: 'anthropic', name: 'Anthropic', color: 'text-orange-400', bg: 'bg-orange-950/50', border: 'border-orange-700/30' },
  { id: 'google', name: 'Google AI', color: 'text-blue-400', bg: 'bg-blue-950/50', border: 'border-blue-700/30' },
  { id: 'other', name: 'Otro', color: 'text-purple-400', bg: 'bg-purple-950/50', border: 'border-purple-700/30' },
];

export default function CostDashboard() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    provider: 'openai',
    model: '',
    tokens: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    try {
      const saved = localStorage.getItem('cost_entries');
      if (saved) setEntries(JSON.parse(saved));
    } catch (err) {
      console.error('Error cargando costos:', err);
    }
  };

  const saveEntries = (updated) => {
    setEntries(updated);
    localStorage.setItem('cost_entries', JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!newEntry.model || !newEntry.cost) return;
    const entry = {
      id: Date.now(),
      ...newEntry,
      tokens: parseInt(newEntry.tokens) || 0,
      cost: parseFloat(newEntry.cost) || 0,
    };
    saveEntries([entry, ...entries]);
    setNewEntry({ provider: 'openai', model: '', tokens: '', cost: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    if (window.confirm('¿Eliminar este registro?')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  // Estadísticas
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0);
  const totalTokens = entries.reduce((sum, e) => sum + e.tokens, 0);

  const costsByProvider = {};
  entries.forEach(e => {
    costsByProvider[e.provider] = (costsByProvider[e.provider] || 0) + e.cost;
  });

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyCost = entries
    .filter(e => e.date.startsWith(thisMonth))
    .reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Dashboard de Costos</h3>
            <p className="text-xs text-slate-500">Tracking de gastos en APIs de IA</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-lg shadow-emerald-500/20"
        >
          <Plus size={14} />
          <span>Registrar</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Total Gastado</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-slate-400">Este Mes</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${monthlyCost.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-purple-400" />
            <span className="text-xs font-medium text-slate-400">Total Tokens</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalTokens.toLocaleString()}</p>
        </div>
      </div>

      {/* Costos por proveedor */}
      {Object.keys(costsByProvider).length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Costos por Proveedor</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROVIDERS.filter(p => costsByProvider[p.id]).map(provider => (
              <div key={provider.id} className={`${provider.bg} border ${provider.border} rounded-lg p-3`}>
                <p className={`text-xs font-medium ${provider.color} mb-1`}>{provider.name}</p>
                <p className="text-lg font-bold text-slate-100">${costsByProvider[provider.id].toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Nuevo Registro</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Proveedor</label>
              <select
                value={newEntry.provider}
                onChange={(e) => setNewEntry({ ...newEntry, provider: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
              >
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Modelo</label>
              <input
                type="text"
                value={newEntry.model}
                onChange={(e) => setNewEntry({ ...newEntry, model: e.target.value })}
                placeholder="Ej: gpt-4, claude-3"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tokens</label>
              <input
                type="number"
                value={newEntry.tokens}
                onChange={(e) => setNewEntry({ ...newEntry, tokens: e.target.value })}
                placeholder="1000"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Costo (USD)</label>
              <input
                type="number"
                step="0.01"
                value={newEntry.cost}
                onChange={(e) => setNewEntry({ ...newEntry, cost: e.target.value })}
                placeholder="0.05"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fecha</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition border border-slate-700/50">Cancelar</button>
            <button onClick={addEntry} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition">Guardar</button>
          </div>
        </div>
      )}

      {/* Historial */}
      {entries.length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Historial</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.map(entry => {
              const provider = PROVIDERS.find(p => p.id === entry.provider) || PROVIDERS[3];
              return (
                <div key={entry.id} className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${provider.bg} ${provider.color} border ${provider.border}`}>
                      {provider.name}
                    </span>
                    <div>
                      <p className="text-sm text-slate-200 font-mono">{entry.model}</p>
                      <p className="text-xs text-slate-500">{entry.date} • {entry.tokens.toLocaleString()} tokens</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-400">${entry.cost.toFixed(2)}</span>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1 rounded bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No hay registros de costos</p>
          <p className="text-xs text-slate-500">Registra tu primer gasto para empezar el tracking</p>
        </div>
      )}
    </div>
  );
}
