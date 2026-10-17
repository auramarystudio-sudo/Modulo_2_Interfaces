import { useState, useEffect } from 'react';
import { Cpu, MemoryStick, HardDrive, Activity, RefreshCw } from 'lucide-react';

export default function SystemMonitor() {
  const [stats, setStats] = useState({
    cpu: { cores: 0, usage: 0 },
    memory: { total: 0, used: 0, percent: 0 },
    disk: { total: 0, used: 0, percent: 0 },
    gpu: { available: false, name: '', memory: 0 },
    loading: true,
  });

  useEffect(() => {
    loadSystemInfo();
    const interval = setInterval(loadSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemInfo = async () => {
    try {
      // CPU Info
      const cores = navigator.hardwareConcurrency || 0;
      
      // Memory Info (Chrome only)
      let memory = { total: 0, used: 0, percent: 0 };
      if (performance.memory) {
        const total = performance.memory.jsHeapSizeLimit;
        const used = performance.memory.usedJSHeapSize;
        memory = {
          total: Math.round(total / 1024 / 1024),
          used: Math.round(used / 1024 / 1024),
          percent: Math.round((used / total) * 100),
        };
      }

      // GPU Info (WebGL)
      let gpu = { available: false, name: '', memory: 0 };
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpu = {
              available: true,
              name: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
              memory: 0, // No se puede obtener directamente
            };
          }
        }
      } catch (e) {
        console.log('WebGL no disponible');
      }

      // Disk Info (Storage API - limitado)
      let disk = { total: 0, used: 0, percent: 0 };
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        disk = {
          total: Math.round((estimate.quota || 0) / 1024 / 1024 / 1024 * 10) / 10,
          used: Math.round((estimate.usage || 0) / 1024 / 1024 / 1024 * 10) / 10,
          percent: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0,
        };
      }

      setStats({
        cpu: { cores, usage: 0 }, // No se puede obtener uso real de CPU desde el navegador
        memory,
        disk,
        gpu,
        loading: false,
      });
    } catch (err) {
      console.error('Error cargando info del sistema:', err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const formatGB = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Monitor del Sistema</h3>
            <p className="text-xs text-slate-500">Recursos en tiempo real</p>
          </div>
        </div>
        <button
          onClick={loadSystemInfo}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <RefreshCw size={16} className={stats.loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-slate-200">CPU</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Núcleos</span>
              <span className="text-slate-200 font-mono">{stats.cpu.cores}</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '0%' }} />
            </div>
            <p className="text-xs text-slate-500">Uso no disponible en navegador</p>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MemoryStick size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-slate-200">Memoria</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Usado</span>
              <span className="text-slate-200 font-mono">{formatGB(stats.memory.used)} / {formatGB(stats.memory.total)}</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${stats.memory.percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{stats.memory.percent}% usado</p>
          </div>
        </div>

        {/* Disk */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-slate-200">Disco</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Usado</span>
              <span className="text-slate-200 font-mono">{stats.disk.used} GB / {stats.disk.total} GB</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all"
                style={{ width: `${stats.disk.percent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{stats.disk.percent}% usado</p>
          </div>
        </div>

        {/* GPU */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-slate-200">GPU</span>
          </div>
          <div className="space-y-2">
            {stats.gpu.available ? (
              <>
                <p className="text-xs text-slate-200 font-mono truncate" title={stats.gpu.name}>
                  {stats.gpu.name}
                </p>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-xs text-slate-500">Detectada</p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500">No detectada</p>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-xs text-slate-500">WebGL no disponible</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
