// Tarjeta individual de servidor de red local
import { ExternalLink, Edit, Trash2, Server, MessageSquare, Cpu, CheckCircle, XCircle } from 'lucide-react';

// Iconos según tipo de servidor
const ICONOS_TIPO = {
  chatbox_ui: { icon: MessageSquare, color: 'text-purple-400', label: 'Chatbox UI' },
  api_backend: { icon: Cpu, color: 'text-blue-400', label: 'API Backend' },
  sd_server: { icon: Server, color: 'text-orange-400', label: 'SD Server' },
};

// Colores de badge según estado
const BADGE_ESTADO = {
  activo: {
    bg: 'bg-green-900/50',
    text: 'text-green-300',
    border: 'border-green-700',
    label: 'Activo',
  },
  inactivo: {
    bg: 'bg-red-900/50',
    text: 'text-red-300',
    border: 'border-red-700',
    label: 'Inactivo',
  },
};

export default function ServerCard({ server, onEdit, onDelete }) {
  // Abrir URL en nueva pestaña
  const handleOpen = () => {
    window.open(server.url_acceso, '_blank', 'noopener,noreferrer');
  };

  // Confirmar eliminación
  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${server.nombre}"?`)) {
      onDelete(server.id);
    }
  };

  const badge = BADGE_ESTADO[server.estado] || BADGE_ESTADO.activo;
  const tipoInfo = ICONOS_TIPO[server.tipo_servidor] || ICONOS_TIPO.api_backend;
  const TipoIcon = tipoInfo.icon;

  // Parsear modelos disponibles (separados por salto de línea)
  const modelos = server.modelos_disponibles
    ? server.modelos_disponibles.split('\n').filter(m => m.trim())
    : [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-cyan-900/10 group">
      {/* Cabecera de la tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-700/50 ${tipoInfo.color}`}>
            <TipoIcon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {server.nombre}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              server.tipo_servidor === 'chatbox_ui' ? 'bg-purple-900/30 text-purple-300 border-purple-700' :
              server.tipo_servidor === 'sd_server' ? 'bg-orange-900/30 text-orange-300 border-orange-700' :
              'bg-blue-900/30 text-blue-300 border-blue-700'
            }`}>
              {tipoInfo.label}
            </span>
          </div>
        </div>
        {/* Badge de estado */}
        <span className={`${badge.bg} ${badge.text} border ${badge.border} text-xs px-2 py-1 rounded-full`}>
          {badge.label}
        </span>
      </div>

      {/* IP y Puerto */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
          <Server size={14} className="text-slate-500" />
          <span className="font-mono">{server.ip_red}:{server.puerto}</span>
        </div>
      </div>

      {/* URL de acceso clicable */}
      <div className="mb-3">
        <a
          href={server.url_acceso}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
        >
          {server.url_acceso}
        </a>
      </div>

      {/* Descripción */}
      {server.descripcion && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {server.descripcion}
        </p>
      )}

      {/* Modelos disponibles */}
      {modelos.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Modelos disponibles:</p>
          <div className="flex flex-wrap gap-1">
            {modelos.map((modelo, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-700/50 text-slate-300 border border-slate-600 rounded px-2 py-0.5 font-mono"
              >
                {modelo.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
        <button
          onClick={handleOpen}
          className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
          title="Abrir en nueva pestaña"
        >
          <ExternalLink size={14} />
          <span>Abrir</span>
        </button>

        <button
          onClick={() => onEdit(server)}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
          title="Editar servidor"
        >
          <Edit size={14} />
          <span>Editar</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-sm rounded-lg px-3 py-1.5 transition-colors ml-auto"
          title="Eliminar servidor"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
