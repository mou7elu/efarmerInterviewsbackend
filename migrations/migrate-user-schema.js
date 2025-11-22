/**
 * Migration Script pour le modèle User
 * 
 * Ce script met à jour tous les documents User existants pour s'assurer qu'ils ont :
 * - code_ut : code utilisateur unique (4 caractères)
 * - Nom_ut : nom de l'utilisateur
 * - Pren_ut : prénom de l'utilisateur
 * - Tel : téléphone
 * - Genre : genre (0 par défaut)
 * - Sommeil : statut actif/inactif (false par défaut)
 * - ResponsableId : référence au responsable (null par défaut)
 * - Photo : photo de l'utilisateur (null par défaut)
 * - isGodMode : mode administrateur (false par défaut)
 * 
 * Usage: node backend/migrations/migrate-user-schema.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import du modèle User
const User = require('../models/User');

// Fonction pour générer un code_ut unique
const generateCodeUt = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Fonction principale de migration
async function migrateUsers() {
  try {
    console.log('🚀 Démarrage de la migration des utilisateurs...\n');

    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les utilisateurs
    const users = await User.find({});
    console.log(`📊 ${users.length} utilisateur(s) trouvé(s)\n`);

    if (users.length === 0) {
      console.log('ℹ️  Aucun utilisateur à migrer');
      await mongoose.connection.close();
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;
    const existingCodes = new Set();

    // Traiter chaque utilisateur
    for (const user of users) {
      try {
        let needsUpdate = false;
        const updates = {};

        // Vérifier et ajouter code_ut si manquant
        if (!user.code_ut) {
          let code_ut = generateCodeUt();
          // S'assurer de l'unicité
          while (existingCodes.has(code_ut) || await User.findOne({ code_ut })) {
            code_ut = generateCodeUt();
          }
          updates.code_ut = code_ut;
          existingCodes.add(code_ut);
          needsUpdate = true;
          console.log(`  📝 Génération code_ut pour ${user.email}: ${code_ut}`);
        } else {
          existingCodes.add(user.code_ut);
        }

        // Ajouter les champs manquants avec valeurs par défaut
        if (user.Nom_ut === undefined) {
          updates.Nom_ut = '';
          needsUpdate = true;
        }

        if (user.Pren_ut === undefined) {
          updates.Pren_ut = '';
          needsUpdate = true;
        }

        if (user.Tel === undefined) {
          updates.Tel = '';
          needsUpdate = true;
        }

        if (user.Genre === undefined) {
          updates.Genre = 0;
          needsUpdate = true;
        }

        if (user.Sommeil === undefined) {
          updates.Sommeil = false;
          needsUpdate = true;
        }

        if (user.ResponsableId === undefined) {
          updates.ResponsableId = null;
          needsUpdate = true;
        }

        if (user.Photo === undefined) {
          updates.Photo = null;
          needsUpdate = true;
        }

        if (user.isGodMode === undefined) {
          updates.isGodMode = false;
          needsUpdate = true;
        }

        // Migrer les anciens champs si présents
        if (user.name && !user.Nom_ut) {
          const nameParts = user.name.split(' ');
          updates.Nom_ut = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
          updates.Pren_ut = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : user.name;
          needsUpdate = true;
          console.log(`  🔄 Migration name -> Nom_ut/Pren_ut pour ${user.email}`);
        }

        if (user.phone && !user.Tel) {
          updates.Tel = user.phone;
          needsUpdate = true;
          console.log(`  🔄 Migration phone -> Tel pour ${user.email}`);
        }

        if (user.isActive !== undefined && user.Sommeil === undefined) {
          updates.Sommeil = !user.isActive;
          needsUpdate = true;
          console.log(`  🔄 Migration isActive -> Sommeil pour ${user.email}`);
        }

        // Appliquer les mises à jour si nécessaire
        if (needsUpdate) {
          await User.updateOne({ _id: user._id }, { $set: updates });
          updatedCount++;
          console.log(`✅ Utilisateur mis à jour: ${user.email}`);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ Erreur lors de la mise à jour de ${user.email}:`, error.message);
      }
    }

    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`Total d'utilisateurs   : ${users.length}`);
    console.log(`Utilisateurs mis à jour: ${updatedCount}`);
    console.log(`Erreurs                : ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (updatedCount > 0) {
      console.log('✅ Migration terminée avec succès!');
    } else {
      console.log('ℹ️  Aucune mise à jour nécessaire');
    }

    // Vérification post-migration
    console.log('\n🔍 Vérification post-migration...');
    const usersWithoutCode = await User.countDocuments({ code_ut: { $exists: false } });
    if (usersWithoutCode > 0) {
      console.log(`⚠️  Attention: ${usersWithoutCode} utilisateur(s) sans code_ut`);
    } else {
      console.log('✅ Tous les utilisateurs ont un code_ut');
    }

  } catch (error) {
    console.error('❌ Erreur fatale lors de la migration:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n✅ Connexion MongoDB fermée');
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateUsers()
    .then(() => {
      console.log('\n🎉 Migration terminée!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Échec de la migration:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsers };
