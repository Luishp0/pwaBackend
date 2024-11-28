const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} no es un correo válido`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  suscripcion: {
    endpoint: { type: String, unique: true },
    expirationTime: { type: Date, required: false },
    keys: {
      p256dh: { type: String, required: false },
      auth: { type: String, required: false }
    }
  }
}, { timestamps: true });

// Índice único condicional para endpoint
userSchema.index(
  { 'suscripcion.endpoint': 1 },
  { unique: true, partialFilterExpression: { 'suscripcion.endpoint': { $exists: true, $ne: null } } }
);

module.exports = mongoose.model('Usuario', userSchema);
