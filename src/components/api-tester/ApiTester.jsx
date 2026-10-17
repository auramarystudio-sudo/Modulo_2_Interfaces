import { useState, useEffect } from 'react';
import { Send, Loader2, Trash2, History, Zap } from 'lucide-react';
import pb from '../../lib/pocketbase.js';

export default function ApiTester() {
  const [servidores, setServidores] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    loadServidores();
    loadHistory();
  }, []);

  const loadServidores = async () => {
    try {
      const records = await pb.collection('servidores_red').getFullList();
      setServidores(records.filter(s => s.tipo_servidor === 'api_backend'));
    } catch (err) {
      console.error('Error cargando servidores:', err);
    }
  };

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('api_test_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  };

  const saveHistory = (newEntry) => {
    const updated = [newEntry, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('api_test_history', JSON.stringify(updated));
  };

  const handleServerChange = async (serverId) => {
    const server = servidores.find(s => s.id === serverId);
    setSelectedServer(server);
    if (server && server.nombre.toLowerCase().includes('ollama')) {
      await loadOllamaModels(server.url_acceso);
    }
  };

  const loadOllamaModels = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      const data = await response.json();
      setModels(data.models || []);
      if (data.models && data.models.length > 0) {
        setModel(data.models[0].name);
      }
    } catch (err) {
      console.error('Error cargando modelos:', err);
    }
  };

  const testApi = async () => {
    if (!selectedServer || !prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setStreaming(true);

    try {
      const isOllama = selectedServer.nombre.toLowerCase().includes('ollama');
      
      if (isOllama) {
        // Ollama API
        const response = await fetch(`${selectedServer.url_acceso}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
            stream: true,
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.response) {
                fullResponse += json.response;
                setResponse(fullResponse);
              }
            } catch (e) {
              // Ignorar líneas no JSON
            }
          }
        }

        saveHistory({
          id: Date.now(),
          server: selectedServer.nombre,
          model: model,
          prompt: prompt,
          response: fullResponse,
          timestamp: new Date().toISOString(),
        });
      } else {
        setResponse('API no soportada para streaming. Solo Ollama está implementado.');
      }
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('api_test_history');
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Probador de APIs</h3>
          <p className="text-xs text-slate-500">Prueba modelos con streaming en tiempo real</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Selector de servidor */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Servidor</label>
          <select
            value={selectedServer?.id || ''}
            onChange={(e) => handleServerChange(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
          >
            <option value="">Selecciona un servidor...</option>
            {servidores.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        {/* Selector de modelo */}
        {models.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Modelo</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
            >
              {models.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt aquí..."
            rows={4}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition resize-none"
          />
        </div>

        {/* Botón enviar */}
        <button
          onClick={testApi}
          disabled={!selectedServer || !prompt.trim() || loading}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium transition shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Enviar Prompt</span>
            </>
          )}
        </button>

        {/* Respuesta */}
        {response && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-violet-400" />
              <span className="text-xs font-medium text-slate-400">Respuesta {streaming && '(streaming...)'}</span>
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <div className="border-t border-slate-800/50 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-200">Historial</span>
              </div>
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
                title="Limpiar historial"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice(0, 10).map(entry => (
                <div key={entry.id} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-violet-400 font-mono">{entry.model}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{entry.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
