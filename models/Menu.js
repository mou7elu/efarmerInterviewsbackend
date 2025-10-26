const mongoose = require('mongoose');

const subMenuSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },// Texte du sous-menu
  path: {
    type: String,
    required: true,
  }// Chemin du sous-menu
});// Schéma pour les sous-menus

const menuSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },// Texte du menu
  icon: {
    type: String,
    required: false,
  },// Icône du menu
  path: {
    type: String,
    required: false,
  },// Chemin du menu
  subMenu: [subMenuSchema],
  order: {
    type: Number,
    default: 0,
  }// Ordre du menu
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Validation pour s'assurer qu'un menu a soit un path soit un subMenu
menuSchema.pre('validate', function(next) {
  if (!this.path && (!this.subMenu || this.subMenu.length === 0)) {
    this.invalidate('path', 'Un menu doit avoir soit un path soit un subMenu');
  }
  if (this.path && this.subMenu && this.subMenu.length > 0) {
    this.invalidate('path', 'Un menu ne peut pas avoir à la fois un path et un subMenu');
  }
  next();
});

// Méthode pour convertir en DTO (Data Transfer Object)
menuSchema.methods.toDTO = function() {
  return {
    id: this._id,
    text: this.text,
    icon: this.icon,
    path: this.path,
    subMenu: this.subMenu,
    order: this.order,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Exporter le modèle
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;