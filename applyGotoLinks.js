/**
 * Script pour appliquer manuellement les sauts logiques les plus importants
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function applyGotoLinks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Mapping principal confirmé
    const confirmedMappings = [
      {
        source: 'Q006', // "Êtes-vous l'exploitant ?"
        condition: 'Oui',
        target: 'Q014' // "Avez-vous reçu une formation agricole ?"
      },
      {
        source: 'Q027', // "Combien de personnes vivent dans le ménage ?"
        condition: '0',
        target: 'Q028' // "Combien d'enfants avez-vous ?"
      }
    ];

    let linksApplied = 0;

    for (const mapping of confirmedMappings) {
      console.log(`\n🔗 Application du saut: ${mapping.source} (${mapping.condition}) → ${mapping.target}`);
      
      // Récupérer la question source
      const sourceQuestion = await Question.findOne({ code: mapping.source });
      if (!sourceQuestion) {
        console.log(`   ❌ Question source ${mapping.source} non trouvée`);
        continue;
      }

      // Récupérer la question cible
      const targetQuestion = await Question.findOne({ code: mapping.target });
      if (!targetQuestion) {
        console.log(`   ❌ Question cible ${mapping.target} non trouvée`);
        continue;
      }

      console.log(`   📝 Source: "${sourceQuestion.texte}"`);
      console.log(`   📝 Cible: "${targetQuestion.texte}"`);
      console.log(`   📝 Options disponibles:`, sourceQuestion.options.map(o => o.libelle));

      // Trouver l'option correspondante
      const matchingOption = sourceQuestion.options.find(opt => 
        opt.libelle.toLowerCase() === mapping.condition.toLowerCase() ||
        opt.valeur.toLowerCase() === mapping.condition.toLowerCase()
      );

      if (matchingOption) {
        // Appliquer le saut
        matchingOption.goto = targetQuestion._id.toString();
        await sourceQuestion.save();
        linksApplied++;
        console.log(`   ✅ Saut appliqué: option "${matchingOption.libelle}" → ${mapping.target} (${targetQuestion._id})`);
      } else {
        console.log(`   ❌ Option "${mapping.condition}" non trouvée`);
        console.log(`   📋 Options disponibles: ${sourceQuestion.options.map(o => `"${o.libelle}"`).join(', ')}`);
      }
    }

    console.log(`\n🎉 ${linksApplied} sauts logiques appliqués avec succès !`);

    // Vérification finale
    console.log('\n🔍 VÉRIFICATION DES LIENS APPLIQUÉS:');
    const questionsWithGoto = await Question.find({
      'options.goto': { $exists: true, $ne: null }
    });

    for (const question of questionsWithGoto) {
      console.log(`\n📝 ${question.code}: ${question.texte}`);
      for (const option of question.options) {
        if (option.goto) {
          const targetQuestion = await Question.findById(option.goto);
          console.log(`   → Option "${option.libelle}" va vers: ${targetQuestion ? targetQuestion.code : 'INTROUVABLE'}`);
          if (targetQuestion) {
            console.log(`     Cible: "${targetQuestion.texte.substring(0, 60)}..."`);
          }
        }
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

applyGotoLinks();