const mongoose = require('mongoose');

// ── Esquema de Ticket ────────────────────────────────────────
const ticketSchema = new mongoose.Schema(
  {
    // Identificador legible (ej. TK-00042)
    codigo: {
      type: String,
      unique: true,
    },

    // Datos del solicitante
    solicitante: {
      nombre: {
        type: String,
        required: [true, 'El nombre del solicitante es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede superar 100 caracteres'],
      },
      correo: {
        type: String,
        required: [true, 'El correo del solicitante es obligatorio'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Ingrese un correo válido'],
      },
      telefono: {
        type: String,
        trim: true,
        default: null,
      },
      departamento: {
        type: String,
        trim: true,
        default: null,
      },
    },

    // Detalles del incidente
    titulo: {
      type: String,
      required: [true, 'El título del incidente es obligatorio'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [150, 'El título no puede superar 150 caracteres'],
    },

    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
    },

    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: [
          'hardware-servidor',
          'hardware-almacenamiento',
          'hardware-periferico',
          'red-lan',
          'red-wan',
          'red-vpn',
          'software-so',
          'software-bd',
          'software-aplicacion',
          'software-seguridad',
        ],
        message: 'Categoría no válida: {VALUE}',
      },
    },

    prioridad: {
      type: String,
      required: [true, 'La prioridad es obligatoria'],
      enum: {
        values: ['critica', 'alta', 'media', 'baja'],
        message: 'Prioridad no válida: {VALUE}',
      },
      default: 'media',
    },

    estado: {
      type: String,
      enum: {
        values: ['abierto', 'en-proceso', 'resuelto', 'cerrado'],
        message: 'Estado no válido: {VALUE}',
      },
      default: 'abierto',
    },

    // Equipo afectado
    equipoAfectado: {
      nombre: { type: String, trim: true, default: null },
      ip:     { type: String, trim: true, default: null },
    },

    // Impacto
    usuariosAfectados: {
      type: String,
      enum: ['solo-yo', 'mi-equipo', 'departamento', 'toda-organizacion', null],
      default: null,
    },

    serviciosAfectados: {
      type: [String],
      default: [],
    },

    // Asignación
    tecnicoAsignado: {
      nombre:      { type: String, default: null },
      especialidad:{ type: String, default: null },
    },

    // Resolución
    solucionAplicada: {
      type: String,
      trim: true,
      default: null,
    },

    fechaDeteccion: {
      type: Date,
      default: null,
    },

    fechaResolucion: {
      type: Date,
      default: null,
    },

    // Notas internas del técnico
    notas: [
      {
        texto:  { type: String, required: true },
        autor:  { type: String, default: 'Sistema' },
        fecha:  { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,  // createdAt, updatedAt automáticos
    versionKey: false,
  }
);

// ── Middleware pre-save: generar código legible ──────────────
ticketSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const count = await this.constructor.countDocuments();
  this.codigo = `TK-${String(count + 1).padStart(5, '0')}`;
  next();
});

// ── Índices para búsquedas frecuentes ───────────────────────
ticketSchema.index({ estado: 1 });
ticketSchema.index({ prioridad: 1 });
ticketSchema.index({ categoria: 1 });
ticketSchema.index({ 'solicitante.correo': 1 });
ticketSchema.index({ createdAt: -1 });

// ── Método virtual: grupo de categoría ──────────────────────
ticketSchema.virtual('grupoCategoria').get(function () {
  const cat = this.categoria || '';
  if (cat.startsWith('hardware')) return 'Hardware';
  if (cat.startsWith('red'))      return 'Red';
  if (cat.startsWith('software')) return 'Software';
  return 'Otro';
});

ticketSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Ticket', ticketSchema);
