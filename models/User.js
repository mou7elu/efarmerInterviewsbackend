const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },// Email de l'utilisateur
  code_ut: { type: String, required: true, unique: true },// automatiquement généré de façon unique 4 caractères pour la generation du code du menage
  password: { type: String, required: true },// Mot de passe de l'utilisateur
  profileId: { 
    type: Number, 
    
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

// Convertir la photo base64 en Buffer avant de sauvegarder
userSchema.pre("save", function (next) {
  if (this.isModified("Photo") && this.Photo) {
    if (typeof this.Photo === 'string' && this.Photo.startsWith('data:')) {
      // Extraire la partie base64
      const base64Data = this.Photo.replace(/^data:image\/\w+;base64,/, '');
      this.Photo = Buffer.from(base64Data, 'base64');
    }
  }
  next();
});

// Convertir la photo base64 en Buffer lors d'une mise à jour
userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.Photo && typeof update.Photo === 'string' && update.Photo.startsWith('data:')) {
    const base64Data = update.Photo.replace(/^data:image\/\w+;base64,/, '');
    update.Photo = Buffer.from(base64Data, 'base64');
  }
  next();
});

// Méthode pour convertir en DTO (Data Transfer Object)
userSchema.methods.toDTO = function() {
  const dto = {
    id: this._id,
    email: this.email,
    Nom_ut: this.Nom_ut,
    Pren_ut: this.Pren_ut,
    code_ut: this.code_ut,
    // Alias pour compatibilité frontend
    firstName: this.Nom_ut,
    lastName: this.Pren_ut,
    Tel: this.Tel,
    Genre: this.Genre,
    profileId: this.profileId,
    isGodMode: this.isGodMode,
    Sommeil: this.Sommeil,
    ResponsableId: this.ResponsableId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isActive: !this.Sommeil,
    role: this.isGodMode ? 'admin' : 'user'
  };

  // Convertir la photo Buffer en base64 si elle existe
  if (this.Photo) {
    if (Buffer.isBuffer(this.Photo)) {
      // Utiliser image/png par défaut car c'est universel
      const photoBase64 = `data:image/png;base64,${this.Photo.toString('base64')}`;
      dto.Photo = photoBase64;
      dto.photo = photoBase64; // Alias pour compatibilité
    } else if (typeof this.Photo === 'string') {
      dto.Photo = this.Photo;
      dto.photo = this.Photo; // Alias pour compatibilité
    }
  }

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

// Force delete the cached model to ensure schema updates are loaded
if (mongoose.models.User) {
  delete mongoose.models.User;
  delete mongoose.connection.models.User;
}

module.exports = mongoose.model("User", userSchema);
