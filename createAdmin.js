const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Modèle User simple
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion à MongoDB établie');

    // Vérifier si l'utilisateur admin existe
    const existingAdmin = await User.findOne({ email: 'admin@efarmer.com' });
    
    if (existingAdmin) {
      console.log('👤 Utilisateur admin existe déjà');
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.updateOne(
        { email: 'admin@efarmer.com' },
        { 
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'eFarmer',
          role: 'admin',
          isActive: true
        }
      );
      console.log('🔄 Utilisateur admin mis à jour avec le mot de passe: 123456');
    } else {
      // Créer l'utilisateur admin
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      const adminUser = new User({
        email: 'admin@efarmer.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'eFarmer',
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Utilisateur admin créé avec succès!');
      console.log('📧 Email: admin@efarmer.com');
      console.log('🔑 Mot de passe: 123456');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnexion de MongoDB');
  }
}

createAdminUser();