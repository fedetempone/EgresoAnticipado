const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importamos bcryptjs para encriptar contraseñas

const usuarioSchema = new mongoose.Schema({
  legajo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  contraseña: { type: String, required: true }, // Aquí almacenamos la contraseña encriptada
  codigo: { type: String, required: true },
});

// Encriptar la contraseña antes de guardar el usuario en la base de datos
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('contraseña')) return next(); // Si la contraseña no ha sido modificada, no la encriptamos
  try {
    const salt = await bcrypt.genSalt(10); // Generamos un "sal" para encriptar
    this.contraseña = await bcrypt.hash(this.contraseña, salt); // Encriptamos la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar la contraseña ingresada con la almacenada en la base de datos
usuarioSchema.methods.compararContraseña = async function(contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña); // Compara la contraseña
};

module.exports = mongoose.model('Usuario', usuarioSchema);

