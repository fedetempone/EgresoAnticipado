const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  Lunes: { type: [String], default: Array(8).fill('') },
  Martes: { type: [String], default: Array(8).fill('') },
  Miércoles: { type: [String], default: Array(8).fill('') },
  Jueves: { type: [String], default: Array(8).fill('') },
  Viernes: { type: [String], default: Array(8).fill('') },
});

const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno;
