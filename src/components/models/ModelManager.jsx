import { useState, useEffect } from 'react';
import { Boxes, Trash2, Download, RefreshCw, HardDrive, Calendar, Tag } from 'lucide-react';
import pb from '../../lib/pocketbase.js';

export default function ModelManager() {
  const [servidores, setServidores] = useState([]);
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServidores();
  }, []);

  const loadServidores = async () => {
    try {
      const records = await pb.collection('servidores_red').getFullList();
      setServidores(records.filter(s => s.tipo_servidor === 'api_backend' || s.tipo_servidor === 'sd_server'));
    } catch (err) {
      console.error('Error cargando servidores:', err);
    }
  };

  const loadAllModels = async () => {
    setLoading(true);
    setError('');
    const newModels = {};

    for (const server of servidores) {
      try {
        if (server.nombre.toLowerCase().includes('ollama') || server.puerto === 11434) {
          // Ollama
          const response = await fetch(`${server.url_acceso}/api/tags`, { signal: AbortSignal.timeout(5000) });
          const data = await response.json();
          newModels[server.id] = {
            server: server.nombre,
            type: 'ollama',
            models: (data.models || []).map(m => ({
              name: m.name,
              size: m.size,
              modified: m.modified_at,
              digest: m.digest?.substring(0, 12),
            })),
          };
        } else if (server.tipo_servidor === 'sd_server') {
          // Stable Diffusion
          const response = await fetch(`${server.url_acceso}/sdapi/v1/sd-models`, { signal: AbortSignal.timeout(5000) });
          const data = await response.json();
          newModels[server.id] = {
            server: server.nombre,
            type: 'sd',
            models: (data || []).map(m => ({
              name: m.model_name || m.title,
              path: m.filename,
              hash: m.hash,
            })),
          };
        }
      } catch (err) {
        console.error(`Error cargando modelos de ${server.nombre}:`, err);
      }
    }

    setModels(newModels);
    setLoading(false);
  };

  const deleteOllamaModel = async (serverId, modelName) => {
    if (!window.confirm(`¿Eliminar el modelo "${modelName}"?`)) return;
    const server = servidores.find(s => s.id === serverId);
    try {
      await fetch(`${server.url_acceso}/api/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName }),
      });
      loadAllModels();
    } catch (err) {
      setError(`Error eliminando modelo: ${err.message}`);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const gb = bytes / 1024 / 1024 / 1024;
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(0)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Gestor de Modelos</h3>
            <p className="text-xs text-slate-500">Modelos de Ollama y Stable Diffusion</p>
          </div>
        </div>
        <button
          onClick={loadAllModels}
          disabled={loading || servidores.length === 0}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition border border-slate-700/50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Actualizar</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-700/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {servidores.length === 0 ? (
        <div className="text-center py-8">
          <Boxes size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-2">No hay servidores configurados</p>
          <p className="text-xs text-slate-500">Añade servidores Ollama o SD en la sección de Servidores</p>
        </div>
      ) : Object.keys(models).length === 0 && !loading ? (
        <div className="text-center py-8">
          <Boxes size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-4">No se han cargado los modelos aún</p>
          <button
            onClick={loadAllModels}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
          >
            <Download size={16} />
            <span>Cargar Modelos</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(models).map(([serverId, data]) => (
            <div key={serverId} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className={data.type === 'ollama' ? 'text-cyan-400' : 'text-orange-400'} />
                  <h4 className="text-sm font-bold text-slate-200">{data.server}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${
                    data.type === 'ollama' 
                      ? 'bg-cyan-950/50 text-cyan-300 border-cyan-700/30' 
                      : 'bg-orange-950/50 text-orange-300 border-orange-700/30'
                  }`}>
                    {data.type === 'ollama' ? 'Ollama' : 'SD'}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{data.models.length} modelos</span>
              </div>

              {data.models.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay modelos disponibles</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.models.map((model, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900/50 border border-slate-700/30 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 font-mono truncate">{model.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {model.size && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <HardDrive size={10} />
                              {formatSize(model.size)}
                            </span>
                          )}
                          {model.modified && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar size={10} />
                              {formatDate(model.modified)}
                            </span>
                          )}
                          {model.digest && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Tag size={10} />
                              {model.digest}
                            </span>
                          )}
                        </div>
                      </div>
                      {data.type === 'ollama' && (
                        <button
                          onClick={() => deleteOllamaModel(serverId, model.name)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition"
                          title="Eliminar modelo"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
