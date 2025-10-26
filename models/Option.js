const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  valeur: {
    type: String,
    required: true,
  }, // Valeur stockée (ex: "M", "F")
  libelle: {
    type: String,
    required: true,
  }, // Libellé affiché (ex: "Masculin")
  goto: {
    type: String,
    default: null,
  } // Id de la question suivante (saut logique)
}, { _id: false }); // pas d'identifiant propre, inclus dans la question

module.exports = OptionSchema;
