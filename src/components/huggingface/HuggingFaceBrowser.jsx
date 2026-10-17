import { useState } from 'react';
import { Search, Download, ExternalLink, Loader2, HardDrive, Tag, User } from 'lucide-react';

export default function HuggingFaceBrowser() {
  const [query, setQuery] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchModels = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=20&sort=downloads`);
      const data = await response.json();
      setModels(data);
    } catch (err) {
      setError(`Error buscando modelos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const gb = bytes / 1024 / 1024 / 1024;
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(0)} MB`;
  };

  const generateOllamaCommand = (modelId) => {
    return `ollama pull ${modelId}`;
  };

  const generateHFCommand = (modelId) => {
    return `huggingface-cli download ${modelId}`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Buscador de HuggingFace</h3>
          <p className="text-xs text-slate-500">Descubre y descarga modelos de IA</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Búsqueda */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchModels()}
            placeholder="Buscar modelos (ej: llama, mistral, sdxl)..."
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition"
          />
          <button
            onClick={searchModels}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white text-sm font-medium transition shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span>Buscar</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-700/30 rounded-lg p-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Resultados */}
        {models.length > 0 && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {models.map((model) => (
              <div key={model.id} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{model.id}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <User size={10} />
                        {model.author || 'Unknown'}
                      </span>
                      {model.downloads && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Download size={10} />
                          {model.downloads.toLocaleString()}
                        </span>
                      )}
                      {model.tags && model.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs text-slate-500">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`https://huggingface.co/${model.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
                    title="Ver en HuggingFace"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {model.pipeline_tag && (
                  <p className="text-xs text-slate-400 mb-2">
                    <span className="text-yellow-400">{model.pipeline_tag}</span>
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(generateOllamaCommand(model.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition"
                    title="Copiar comando Ollama"
                  >
                    <Download size={12} />
                    <span>Ollama</span>
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateHFCommand(model.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium transition"
                    title="Copiar comando HuggingFace CLI"
                  >
                    <Download size={12} />
                    <span>HF CLI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && models.length === 0 && query && (
          <div className="text-center py-8">
            <Search size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No se encontraron modelos</p>
          </div>
        )}
      </div>
    </div>
  );
}
