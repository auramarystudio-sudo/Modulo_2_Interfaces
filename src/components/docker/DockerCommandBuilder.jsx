import { useState } from 'react';
import { Plus, Trash2, Copy, Check, Container, HardDrive, Settings, Globe } from 'lucide-react';

export default function DockerCommandBuilder() {
  const [imageName, setImageName] = useState('');
  const [containerName, setContainerName] = useState('');
  const [ports, setPorts] = useState([{ host: '', container: '', protocol: 'tcp' }]);
  const [volumes, setVolumes] = useState([{ host: '', container: '' }]);
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }]);
  const [detached, setDetached] = useState(true);
  const [restart, setRestart] = useState('no');
  const [network, setNetwork] = useState('');
  const [copied, setCopied] = useState(false);

  const addPort = () => setPorts([...ports, { host: '', container: '', protocol: 'tcp' }]);
  const removePort = (idx) => setPorts(ports.filter((_, i) => i !== idx));
  const updatePort = (idx, field, value) => {
    const newPorts = [...ports];
    newPorts[idx][field] = value;
    setPorts(newPorts);
  };

  const addVolume = () => setVolumes([...volumes, { host: '', container: '' }]);
  const removeVolume = (idx) => setVolumes(volumes.filter((_, i) => i !== idx));
  const updateVolume = (idx, field, value) => {
    const newVolumes = [...volumes];
    newVolumes[idx][field] = value;
    setVolumes(newVolumes);
  };

  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const removeEnvVar = (idx) => setEnvVars(envVars.filter((_, i) => i !== idx));
  const updateEnvVar = (idx, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[idx][field] = value;
    setEnvVars(newEnvVars);
  };

  const generateCommand = () => {
    let cmd = 'docker run';

    if (detached) cmd += ' -d';

    if (containerName) cmd += ` --name ${containerName}`;

    if (restart !== 'no') cmd += ` --restart ${restart}`;

    if (network) cmd += ` --network ${network}`;

    ports.forEach(port => {
      if (port.host && port.container) {
        cmd += ` -p ${port.host}:${port.container}`;
        if (port.protocol === 'udp') cmd += '/udp';
      }
    });

    volumes.forEach(vol => {
      if (vol.host && vol.container) {
        cmd += ` -v ${vol.host}:${vol.container}`;
      }
    });

    envVars.forEach(env => {
      if (env.key) {
        cmd += ` -e ${env.key}=${env.value}`;
      }
    });

    if (imageName) cmd += ` ${imageName}`;

    return cmd;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <Container className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Generador de Comandos Docker</h3>
          <p className="text-xs text-slate-500">Construye comandos docker run visualmente</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Imagen */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Imagen *</label>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Ej: nginx:latest, postgres:15"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-sm"
          />
        </div>

        {/* Nombre del contenedor */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre del Contenedor</label>
          <input
            type="text"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            placeholder="Ej: mi-servidor"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-sm"
          />
        </div>

        {/* Opciones básicas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
              <input
                type="checkbox"
                checked={detached}
                onChange={(e) => setDetached(e.target.checked)}
                className="rounded border-slate-600 text-blue-500 focus:ring-blue-500/20 bg-slate-700"
              />
              Modo Detached (-d)
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Restart Policy</label>
            <select
              value={restart}
              onChange={(e) => setRestart(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="no">No</option>
              <option value="always">Always</option>
              <option value="unless-stopped">Unless-stopped</option>
              <option value="on-failure">On-failure</option>
            </select>
          </div>
        </div>

        {/* Red */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
            <Globe size={12} />
            Red
          </label>
          <input
            type="text"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            placeholder="Ej: mi-red, bridge, host"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-sm"
          />
        </div>

        {/* Puertos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Settings size={12} />
              Puertos
            </label>
            <button onClick={addPort} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
              <Plus size={12} />
              <span>Añadir</span>
            </button>
          </div>
          <div className="space-y-2">
            {ports.map((port, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={port.host}
                  onChange={(e) => updatePort(idx, 'host', e.target.value)}
                  placeholder="Host"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="text"
                  value={port.container}
                  onChange={(e) => updatePort(idx, 'container', e.target.value)}
                  placeholder="Container"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                <select
                  value={port.protocol}
                  onChange={(e) => updatePort(idx, 'protocol', e.target.value)}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-2 text-slate-100 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition"
                >
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                </select>
                {ports.length > 1 && (
                  <button onClick={() => removePort(idx)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Volúmenes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <HardDrive size={12} />
              Volúmenes
            </label>
            <button onClick={addVolume} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
              <Plus size={12} />
              <span>Añadir</span>
            </button>
          </div>
          <div className="space-y-2">
            {volumes.map((vol, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={vol.host}
                  onChange={(e) => updateVolume(idx, 'host', e.target.value)}
                  placeholder="/host/path"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="text"
                  value={vol.container}
                  onChange={(e) => updateVolume(idx, 'container', e.target.value)}
                  placeholder="/container/path"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                {volumes.length > 1 && (
                  <button onClick={() => removeVolume(idx)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variables de Entorno */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Settings size={12} />
              Variables de Entorno
            </label>
            <button onClick={addEnvVar} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
              <Plus size={12} />
              <span>Añadir</span>
            </button>
          </div>
          <div className="space-y-2">
            {envVars.map((env, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => updateEnvVar(idx, 'key', e.target.value)}
                  placeholder="KEY"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                <span className="text-slate-500">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => updateEnvVar(idx, 'value', e.target.value)}
                  placeholder="value"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition font-mono text-xs"
                />
                {envVars.length > 1 && (
                  <button onClick={() => removeEnvVar(idx)} className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comando generado */}
        {imageName && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Comando Generado:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <code className="text-sm text-green-400 font-mono break-all">
              {generateCommand()}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
