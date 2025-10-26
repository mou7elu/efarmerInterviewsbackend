/**
 * Script pour ajouter tous les sauts logiques identifiés
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function addAllGotoLinks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Mapping étendu basé sur l'analyse du fichier Word
    const allMappings = [
      // Saut déjà appliqué
      {
        source: 'Q006', // "Êtes-vous l'exploitant ?"
        condition: 'Oui',
        target: 'Q014', // "Avez-vous reçu une formation agricole ?"
        description: 'Si exploitant = Oui → formation'
      },
      
      // Nouveaux sauts à ajouter
      {
        source: 'Q015', // "Quel est votre pays d'origine ?"
        condition: 'Côte d\'Ivoire',
        target: 'Q016', // Question suivante logique
        description: 'Si pays origine = Côte d\'Ivoire → question suivante'
      },
      
      // Sauts pour les questions de formation
      {
        source: 'Q014', // "Avez-vous reçu une formation agricole ?"
        condition: 'Non',
        target: 'Q016', // Sauter les détails de formation
        description: 'Si formation = Non → sauter détails formation'
      },
      
      {
        source: 'Q024', // "Avez-vous suivi une formation agricole ?" (pour exploitant)
        condition: 'Non',
        target: 'Q026', // Sauter les détails de formation
        description: 'Si formation exploitant = Non → sauter détails'
      },
      
      // Sauts pour les questions de compte bancaire
      {
        source: 'Q051', // "Avez-vous un compte bancaire ?"
        condition: 'Non',
        target: 'Q054', // Aller aux questions mobile money
        description: 'Si pas de compte bancaire → mobile money'
      },
      
      {
        source: 'Q054', // "Avez-vous un compte mobile money ?"
        condition: 'Non',
        target: 'Q058', // Sauter les questions mobile money
        description: 'Si pas de mobile money → sauter détails mobile money'
      },
      
      // Sauts pour l'accès Internet
      {
        source: 'Q044', // "Avez-vous accès à Internet ?"
        condition: 'Non',
        target: 'Q045', // Aller à la question suivante
        description: 'Si pas d\'accès Internet → question suivante'
      },
      
      // Sauts pour le stockage
      {
        source: 'Q040', // "Avez-vous un bâtiment de stockage ?"
        condition: 'Non',
        target: 'Q042', // Sauter les détails de stockage
        description: 'Si pas de stockage → sauter détails stockage'
      }
    ];

    let linksApplied = 0;

    for (const mapping of allMappings) {
      console.log(`\n🔗 ${mapping.description}`);
      console.log(`   ${mapping.source} (${mapping.condition}) → ${mapping.target}`);
      
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

      console.log(`   📝 Source: "${sourceQuestion.texte.substring(0, 50)}..."`);
      console.log(`   📝 Cible: "${targetQuestion.texte.substring(0, 50)}..."`);

      // Trouver l'option correspondante
      const matchingOption = sourceQuestion.options.find(opt => {
        const optLower = opt.libelle.toLowerCase().trim();
        const condLower = mapping.condition.toLowerCase().trim();
        
        return optLower === condLower || 
               optLower.includes(condLower) ||
               opt.valeur.toLowerCase() === condLower.replace(/\s+/g, '_').replace(/'/g, '') ||
               (condLower === 'côte d\'ivoire' && optLower.includes('côte'));
      });

      if (matchingOption) {
        // Vérifier si le saut n'existe pas déjà
        if (matchingOption.goto) {
          const existingTarget = await Question.findById(matchingOption.goto);
          console.log(`   ⚠️ Saut déjà existant: "${matchingOption.libelle}" → ${existingTarget?.code || 'INCONNU'}`);
          continue;
        }
        
        // Appliquer le saut
        matchingOption.goto = targetQuestion._id.toString();
        await sourceQuestion.save();
        linksApplied++;
        console.log(`   ✅ Saut appliqué: option "${matchingOption.libelle}" → ${mapping.target}`);
      } else {
        console.log(`   ❌ Option "${mapping.condition}" non trouvée`);
        console.log(`   📋 Options disponibles: ${sourceQuestion.options.map(o => `"${o.libelle}"`).join(', ')}`);
      }
    }

    console.log(`\n🎉 ${linksApplied} nouveaux sauts logiques appliqués !`);

    // Vérification finale de tous les liens
    console.log('\n🔍 RÉCAPITULATIF DE TOUS LES LIENS DE SAUT:');
    const questionsWithGoto = await Question.find({
      'options.goto': { $exists: true, $ne: null }
    }).sort({ code: 1 });

    let totalLinks = 0;
    for (const question of questionsWithGoto) {
      console.log(`\n📝 ${question.code}: ${question.texte.substring(0, 60)}...`);
      for (const option of question.options) {
        if (option.goto) {
          const targetQuestion = await Question.findById(option.goto);
          console.log(`   → "${option.libelle}" va vers: ${targetQuestion ? targetQuestion.code : 'INTROUVABLE'}`);
          if (targetQuestion) {
            console.log(`     "${targetQuestion.texte.substring(0, 50)}..."`);
          }
          totalLinks++;
        }
      }
    }

    console.log(`\n📊 TOTAL: ${totalLinks} liens de saut actifs dans le système`);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

addAllGotoLinks();