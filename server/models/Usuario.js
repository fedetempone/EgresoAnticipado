const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  legajo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  email: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;


