const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    // Connexion à la base de données
    await mongoose.connect('mongodb+srv://gnahouar:gnaweb2019@cluster0.vqpjjgb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/eFarmerInterviews');
    
    console.log('✅ Connecté à MongoDB');
    
    // Récupérer tous les utilisateurs
    const users = await User.find({}).limit(3);
    
    console.log(`📊 Nombre d'utilisateurs trouvés: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log('ID:', user._id);
      console.log('Email:', user.email);
      console.log('Nom_ut:', user.Nom_ut);
      console.log('Pren_ut:', user.Pren_ut);
      console.log('Tel:', user.Tel);
      console.log('Genre:', user.Genre);
      console.log('Sommeil:', user.Sommeil);
      console.log('isGodMode:', user.isGodMode);
      console.log('profileId:', user.profileId);
      console.log('createdAt:', user.createdAt);
      console.log('updatedAt:', user.updatedAt);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

checkUsers();