const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Asegúrate de tener bcryptjs instalado

const usuarioSchema = new mongoose.Schema({
  legajo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
});

// Pre-save middleware para encriptar la contraseña antes de guardarla
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next(); // Si la contraseña no se ha modificado, no la encripta

  try {
    const salt = await bcrypt.genSalt(10); // Generar un "salt"
    this.contraseña = await bcrypt.hash(this.contraseña, salt); // Encriptar la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

