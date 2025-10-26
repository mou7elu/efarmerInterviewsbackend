const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },// Email de l'utilisateur
  password: { type: String, required: true },// Mot de passe de l'utilisateur
  profileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Profile",
    required: false
  },// Référence au profil
  isGodMode: {
    type: Boolean,
    default: false
  },// Indique si l'utilisateur est en mode God
  Nom_ut: {
    type: String,
    default:""
  },// Nom de l'utilisateur
  Pren_ut: {
    type: String,
    default:""
  },// Prénom de l'utilisateur
  Sommeil: {
    type: Boolean,
    default: false,
  },// Indique si l'utilisateur est actif ou inactif
  Photo: {
    type: Buffer,
    default: null,
  },// Photo de l'utilisateur
  Tel: {
    type: String,
    default:""
  },// Téléphone de l'utilisateur
  Genre: {
    type: Number,
    default:0
  },// Genre de l'utilisateur,
   ResponsableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      }// Référence au responsable
}, { timestamps: true });

// Hacher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});//

// Méthode pour convertir en DTO (Data Transfer Object)
userSchema.methods.toDTO = function() {
  const dto = {
    id: this._id,
    email: this.email,
    Nom_ut: this.Nom_ut,
    Pren_ut: this.Pren_ut,
    Tel: this.Tel,
    Genre: this.Genre,
    profileId: this.profileId,
    isGodMode: this.isGodMode,
    Sommeil: this.Sommeil,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };

  // Si le profil est populé, inclure ses détails
  if (this.profileId && typeof this.profileId === 'object' && this.profileId.name) {
    dto.profile = {
      id: this.profileId._id,
      name: this.profileId.name,
      permissions: this.profileId.permissions
    };
  }

  return dto;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
