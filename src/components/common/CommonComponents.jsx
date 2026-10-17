import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Search, X, Grid3X3, List, Star, Loader2, QrCode, Copy, Check, Zap, Clock } from 'lucide-react';

// Health Indicator
export function HealthIndicator({ url, size = 'md' }) {
  const [status, setStatus] = useState('checking');
  const [latency, setLatency] = useState(null);
  const intervalRef = useRef(null);

  const checkHealth = async () => {
    setStatus('checking');
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(url, { mode: 'no-cors', signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeout);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus('online');
    } catch {
      setLatency(null);
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    intervalRef.current = setInterval(checkHealth, 30000);
    return () => clearInterval(intervalRef.current);
  }, [url]);

  const sizeClasses = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  const colors = {
    checking: 'bg-yellow-500 animate-pulse',
    online: 'bg-green-500',
    offline: 'bg-red-500',
  };

  return (
    <div className="relative group" title={status === 'online' ? `En línea (${latency}ms)` : status === 'offline' ? 'Desconectado' : 'Verificando...'}>
      <div className={`${sizeClasses[size]} rounded-full ${colors[status]} transition-all`}>
        {status === 'online' && <div className={`absolute inset-0 rounded-full ${colors[status]} animate-ping opacity-75`} />}
      </div>
    </div>
  );
}

// QR Modal
export function QRModal({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-slate-900 border border-cyan-700/50 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <QRCodeSVG value={url} size={200} level="M" bgColor="#ffffff" fgColor="#0f172a" />
          </div>
          <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-2">
            <code className="text-xs text-cyan-400 font-mono flex-1 truncate">{url}</code>
            <button onClick={handleCopy} className="p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Bar
export function SearchBar({ value, onChange, placeholder = 'Buscar...', filters = [], activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
            <X size={14} />
          </button>
        )}
      </div>
      {filters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(activeFilter === filter.value ? null : filter.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition border ${
                activeFilter === filter.value
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
              {filter.count !== undefined && <span className="ml-1.5 text-slate-500">({filter.count})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// View Toggle
export function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-1">
      <button
        onClick={() => onChange('grid')}
        className={`p-1.5 rounded-md transition ${view === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-white'}`}
        title="Vista de cuadrícula"
      >
        <Grid3X3 size={16} />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-1.5 rounded-md transition ${view === 'list' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-white'}`}
        title="Vista de lista"
      >
        <List size={16} />
      </button>
    </div>
  );
}

// Star Button
export function StarButton({ isFavorite, onToggle, size = 16 }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`p-1 rounded-md transition ${isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-600 hover:text-yellow-400'}`}
      title={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
    >
      <Star size={size} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}

// Last Used
export function LastUsed({ timestamp }) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  let text;
  if (diff < 60000) text = 'Ahora mismo';
  else if (diff < 3600000) text = `Hace ${Math.floor(diff / 60000)}min`;
  else if (diff < 86400000) text = `Hace ${Math.floor(diff / 3600000)}h`;
  else text = `Hace ${Math.floor(diff / 86400000)}d`;

  return (
    <span className="flex items-center gap-1 text-xs text-slate-500" title={date.toLocaleString()}>
      <Clock size={10} />
      {text}
    </span>
  );
}
