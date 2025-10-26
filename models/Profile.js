const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  canAdd: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
  canView: { type: Boolean, default: false }
});// Permissions for each menu item

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },// Nom du profil
  permissions: [permissionSchema]// Permissions associées au profil
}, { timestamps: true });

// Méthode pour convertir en DTO (Data Transfer Object)
profileSchema.methods.toDTO = function() {
  return {
    id: this._id,
    name: this.name,
    permissions: this.permissions,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model("Profile", profileSchema);
