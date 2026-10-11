// Tarjeta individual de interfaz UI local
import { ExternalLink, Edit, Copy, Trash2, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { useState } from 'react';

// Iconos según tipo de interfaz
const ICONOS_TIPO = {
  automatic1111: '🎨',
  comfyui: '🔗',
  forge: '⚒️',
  fooocus: '🖼️',
  sdnext: '🚀',
  otra: '🔧',
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
  mantenimiento: {
    bg: 'bg-yellow-900/50',
    text: 'text-yellow-300',
    border: 'border-yellow-700',
    label: 'Mantenimiento',
  },
};

export default function InterfaceCard({ interfaz, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  // Abrir URL en nueva pestaña
  const handleOpen = () => {
    window.open(interfaz.url_local, '_blank', 'noopener,noreferrer');
  };

  // Copiar comando al portapapeles
  const handleCopyCommand = async () => {
    if (!interfaz.comando_lanzamiento) return;
    try {
      await navigator.clipboard.writeText(interfaz.comando_lanzamiento);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Confirmar eliminación
  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${interfaz.nombre}"?`)) {
      onDelete(interfaz.id);
    }
  };

  const badge = BADGE_ESTADO[interfaz.estado] || BADGE_ESTADO.activo;
  const icono = ICONOS_TIPO[interfaz.tipo] || '🔧';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-cyan-900/10 group">
      {/* Cabecera de la tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={interfaz.tipo}>
            {icono}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {interfaz.nombre}
            </h3>
            <p className="text-xs text-slate-400 capitalize">{interfaz.tipo}</p>
          </div>
        </div>
        {/* Badge de estado */}
        <span className={`${badge.bg} ${badge.text} border ${badge.border} text-xs px-2 py-1 rounded-full`}>
          {badge.label}
        </span>
      </div>

      {/* URL y puerto */}
      <div className="mb-3">
        <p className="text-sm text-slate-300 font-mono bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
          {interfaz.url_local}
        </p>
        <p className="text-xs text-slate-500 mt-1">Puerto: {interfaz.puerto}</p>
      </div>

      {/* Descripción */}
      {interfaz.descripcion && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
          {interfaz.descripcion}
        </p>
      )}

      {/* Comando de lanzamiento */}
      {interfaz.comando_lanzamiento && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Comando:</p>
          <code className="text-xs text-cyan-400 bg-slate-900/50 rounded px-2 py-1 border border-slate-700 block truncate">
            {interfaz.comando_lanzamiento}
          </code>
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
          onClick={() => onEdit(interfaz)}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
          title="Editar interfaz"
        >
          <Edit size={14} />
          <span>Editar</span>
        </button>

        {interfaz.comando_lanzamiento && (
          <button
            onClick={handleCopyCommand}
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
            title="Copiar comando de lanzamiento"
          >
            {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        )}

        <button
          onClick={handleDelete}
          className="flex items-center gap-1 bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-sm rounded-lg px-3 py-1.5 transition-colors ml-auto"
          title="Eliminar interfaz"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
