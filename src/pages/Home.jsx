import { useState, useEffect } from 'react';
import { Monitor, Globe, Layers, Terminal, Server, Cpu, Zap, Network, ArrowRight, Activity, FolderOpen, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '../lib/pocketbase.js';

export default function Home() {
  const [stats, setStats] = useState({
    interfaces: { total: 0, activos: 0 },
    servidores: { total: 0, activos: 0 },
    lanzadores: { total: 0, corriendo: 0 },
    proyectos: { total: 0, corriendo: 0 },
    basesDatos: { total: 0, corriendo: 0 },
    sesiones: { total: 0 },
    loading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const [interfaces, servidores, lanzadores, proyectos, basesDatos, sesiones] = await Promise.all([
          pb.collection('interfaces_ui').getFullList().catch(() => []),
          pb.collection('servidores_red').getFullList().catch(() => []),
          pb.collection('lanzadores').getFullList().catch(() => []),
          pb.collection('proyectos').getFullList().catch(() => []),
          pb.collection('bases_datos').getFullList().catch(() => []),
          pb.collection('sesiones').getFullList().catch(() => []),
        ]);

        setStats({
          interfaces: {
            total: interfaces.length,
            activos: interfaces.filter(i => i.estado === 'activo').length,
          },
          servidores: {
            total: servidores.length,
            activos: servidores.filter(s => s.estado === 'activo').length,
          },
          lanzadores: {
            total: lanzadores.length,
            corriendo: lanzadores.filter(l => l.estado === 'corriendo').length,
          },
          proyectos: {
            total: proyectos.length,
            corriendo: proyectos.filter(p => p.estado === 'corriendo').length,
          },
          basesDatos: {
            total: basesDatos.length,
            corriendo: basesDatos.filter(b => b.estado === 'corriendo').length,
          },
          sesiones: { total: sesiones.length },
          loading: false,
        });
      } catch {
        setStats(prev => ({ ...prev, loading: false }));
      }
    })();
  }, []);

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
          <Zap size={16} className="text-cyan-400" />
          <span className="text-cyan-300 text-sm font-medium">AI Local Manager</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gestiona tus Herramientas
          </span>
          <br />
          <span className="text-slate-100">de IA Local</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Centraliza el acceso a interfaces de generación de imágenes, modelos de lenguaje,
          servidores de red local y lanzadores de servicios desde un solo panel.
        </p>
      </div>

      {/* Widget de Estado Global */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Estado Global</h3>
              <p className="text-xs text-slate-500">Resumen de tus servicios</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Monitor size={16} className="text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-200">Interfaces</span>
                </div>
                <span className="text-xs text-slate-500">{stats.interfaces.total} total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: stats.interfaces.total ? `${(stats.interfaces.activos / stats.interfaces.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-cyan-400 font-mono">
                  {stats.interfaces.activos}/{stats.interfaces.total}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">activas ahora</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-purple-400" />
                  <span className="text-sm font-semibold text-slate-200">Servidores</span>
                </div>
                <span className="text-xs text-slate-500">{stats.servidores.total} total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: stats.servidores.total ? `${(stats.servidores.activos / stats.servidores.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-purple-400 font-mono">
                  {stats.servidores.activos}/{stats.servidores.total}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">respondiendo</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-green-400" />
                  <span className="text-sm font-semibold text-slate-200">Lanzadores</span>
                </div>
                <span className="text-xs text-slate-500">{stats.lanzadores.total} total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: stats.lanzadores.total ? `${(stats.lanzadores.corriendo / stats.lanzadores.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-green-400 font-mono">
                  {stats.lanzadores.corriendo}/{stats.lanzadores.total}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">corriendo</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-pink-400" />
                  <span className="text-sm font-semibold text-slate-200">Proyectos</span>
                </div>
                <span className="text-xs text-slate-500">{stats.proyectos.total} total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: stats.proyectos.total ? `${(stats.proyectos.corriendo / stats.proyectos.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-pink-400 font-mono">
                  {stats.proyectos.corriendo}/{stats.proyectos.total}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">corriendo</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-teal-400" />
                  <span className="text-sm font-semibold text-slate-200">BDs</span>
                </div>
                <span className="text-xs text-slate-500">{stats.basesDatos.total} total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: stats.basesDatos.total ? `${(stats.basesDatos.corriendo / stats.basesDatos.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-teal-400 font-mono">
                  {stats.basesDatos.corriendo}/{stats.basesDatos.total}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">corriendo</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-amber-400" />
                  <span className="text-sm font-semibold text-slate-200">Sesiones</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-amber-400">{stats.sesiones.total}</span>
                <div>
                  <p className="text-xs text-slate-400">presets guardados</p>
                  <Link to="/sesiones" className="text-xs text-amber-400 hover:text-amber-300 transition">
                    Gestionar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto mb-12">
        <Link to="/interfaces" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/20 transition">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition">Interfaces UI</h2>
              <p className="text-xs text-slate-500">A1111, ComfyUI, Forge...</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Gestiona accesos directos a interfaces de generación de imágenes con health check, QR y más.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link to="/servidores" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-purple-500/30 hover:shadow-purple-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/20 transition">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition">Servidores</h2>
              <p className="text-xs text-slate-500">Ollama, SillyTavern...</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Accede a servidores de LLMs y chatboxes desde cualquier dispositivo con integración API en vivo.
          </p>
          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link to="/lanzadores" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-green-500/30 hover:shadow-green-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-green-500/20 transition">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-green-300 transition">Lanzadores</h2>
              <p className="text-xs text-slate-500">Docker, NPM, PocketBase...</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Gestiona Docker, PocketBase, aplicaciones NPM y otros servidores con comandos y variables de entorno.
          </p>
          <div className="flex items-center gap-2 text-green-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link to="/proyectos" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-pink-500/30 hover:shadow-pink-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/20 transition">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-pink-300 transition">Proyectos</h2>
              <p className="text-xs text-slate-500">Hosting local</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Gestiona tus proyectos y aplicaciones locales con dominios virtuales y puertos personalizados.
          </p>
          <div className="flex items-center gap-2 text-pink-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link to="/bases-datos" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-teal-500/20 transition">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition">BDs</h2>
              <p className="text-xs text-slate-500">Bases de datos</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Gestiona conexiones a PostgreSQL, MySQL, MongoDB, Redis y más bases de datos locales.
          </p>
          <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link to="/sesiones" className="group bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-amber-500/30 hover:shadow-amber-500/5 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/20 transition">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition">Sesiones</h2>
              <p className="text-xs text-slate-500">Presets y flujos</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Guarda combinaciones de servicios para activar flujos de trabajo completos con un solo clic.
          </p>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium group-hover:gap-3 transition-all">
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Info PocketBase */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Configuración de PocketBase</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Esta aplicación se conecta a PocketBase para almacenar la configuración de forma persistente.
          </p>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-300 font-mono">
              URL: <span className="text-cyan-400">http://127.0.0.1:8090</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Variable: <code className="text-cyan-400 bg-slate-900/50 px-1.5 py-0.5 rounded">VITE_POCKETBASE_URL</code>
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Colecciones necesarias:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2">
                <Server size={16} className="text-cyan-400" />
                <code className="text-cyan-400 text-sm font-mono">interfaces_ui</code>
                <span className="text-xs text-slate-500">— Interfaces de generación</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2">
                <Cpu size={16} className="text-purple-400" />
                <code className="text-purple-400 text-sm font-mono">servidores_red</code>
                <span className="text-xs text-slate-500">— Servidores de red local</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2">
                <Terminal size={16} className="text-green-400" />
                <code className="text-green-400 text-sm font-mono">lanzadores</code>
                <span className="text-xs text-slate-500">— Docker, NPM, PocketBase...</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2">
                <Layers size={16} className="text-amber-400" />
                <code className="text-amber-400 text-sm font-mono">sesiones</code>
                <span className="text-xs text-slate-500">— Presets y combinaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
