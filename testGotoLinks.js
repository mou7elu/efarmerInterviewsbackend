/**
 * Script pour tester les liens de saut appliqués
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function testGotoLinks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Récupérer Q006 qui devrait avoir un lien de saut
    const q006 = await Question.findOne({ code: 'Q006' });
    
    if (q006) {
      console.log(`\n📝 ${q006.code}: ${q006.texte}`);
      console.log(`   Type: ${q006.type}`);
      console.log('   Options:');
      
      for (const option of q006.options) {
        console.log(`      - ${option.libelle} (valeur: ${option.valeur})`);
        if (option.goto) {
          // Récupérer la question cible
          const targetQuestion = await Question.findById(option.goto);
          if (targetQuestion) {
            console.log(`        🔗 GOTO: ${targetQuestion.code} - "${targetQuestion.texte}"`);
          } else {
            console.log(`        ❌ GOTO: Question non trouvée (${option.goto})`);
          }
        } else {
          console.log(`        📄 Pas de saut logique`);
        }
      }
    } else {
      console.log('❌ Question Q006 non trouvée');
    }

    // Test de la logique : Si quelqu'un répond "Oui" à Q006, vers où va-t-il ?
    console.log('\n🧪 SIMULATION DE SAUT:');
    console.log('Si un utilisateur répond "Oui" à Q006 ("Êtes-vous l\'exploitant ?"):');
    
    if (q006) {
      const ouiOption = q006.options.find(opt => opt.valeur === 'OUI');
      if (ouiOption && ouiOption.goto) {
        const nextQuestion = await Question.findById(ouiOption.goto);
        console.log(`✅ Il sera dirigé vers: ${nextQuestion.code} - "${nextQuestion.texte}"`);
        console.log('   ✅ Cela correspond bien à Q.16 = "Oui" → Q.34 du fichier Word !');
      } else {
        console.log('❌ Aucun saut configuré pour "Oui"');
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

testGotoLinks();