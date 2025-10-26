const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  ordre: {
    type: Number,
    required: true
  },
  voletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volet',
    required: true
  }
}, {
  timestamps: true
});

SectionSchema.methods.toDTO = function() {
  return {
    id: this._id,
    titre: this.titre,
    ordre: this.ordre,
    voletId: this.voletId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.models.Section || mongoose.model('Section', SectionSchema);
