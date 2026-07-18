const mongoose = require('mongoose');

const tecnicoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Ingrese un correo válido'],
    },
    especialidad: {
      type: String,
      required: [true, 'La especialidad es obligatoria'],
      enum: ['hardware', 'red', 'software', 'general'],
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    ticketsActivos: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Tecnico', tecnicoSchema);
