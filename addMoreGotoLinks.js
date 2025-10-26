/**
 * Script pour ajouter des sauts logiques supplémentaires intelligents
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function addMoreGotoLinks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Nouveaux sauts logiques basés sur l'analyse intelligente
    const additionalMappings = [
      // Sauts pour questions de services/conseils
      {
        source: 'Q099', // "Avez-vous recours aux services de conseils agricoles ?"
        condition: 'Non',
        target: 'Q101', // Sauter les détails des services
        description: 'Si pas de conseils agricoles → sauter détails services'
      },
      
      // Sauts pour questions d'engrais et traitements
      {
        source: 'Q102', // "Avez-vous utilisé de l'engrais ces deux dernières années ?"
        condition: 'Non', 
        target: 'Q103', // Aller aux traitements phytosanitaires
        description: 'Si pas d\'engrais → aller aux traitements phytosanitaires'
      },
      
      {
        source: 'Q103', // "Avez-vous effectué des traitements phytosanitaires ?"
        condition: 'Non',
        target: 'Q105', // Sauter les détails de traitements
        description: 'Si pas de traitements → sauter détails traitements'
      },
      
      // Sauts pour les infrastructures de santé
      {
        source: 'Q045', // "Avez-vous accès à des infrastructures de santé ?"
        condition: 'Non',
        target: 'Q047', // Sauter les détails d'accès
        description: 'Si pas d\'accès santé → sauter détails accès'
      },
      
      // Sauts pour les services de mobile money utilisés
      {
        source: 'Q057', // "Avez-vous déjà utilisé les services Mobile Money ?"
        condition: 'Non',
        target: 'Q059', // Sauter les détails d'utilisation
        description: 'Si jamais utilisé mobile money → sauter détails utilisation'
      },
      
      // Sauts additionnels pour optimiser le flux
      {
        source: 'Q006', // "Êtes-vous l'exploitant ?"
        condition: 'Non',
        target: 'Q007', // Aller au lien avec l'exploitant
        description: 'Si pas exploitant → définir lien avec exploitant'
      }
    ];

    let linksApplied = 0;

    for (const mapping of additionalMappings) {
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
               opt.valeur.toLowerCase() === condLower.replace(/\s+/g, '_').replace(/'/g, '');
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

    // Vérification finale avec comptage précis
    console.log('\n🔍 RÉCAPITULATIF FINAL DE TOUS LES SAUTS LOGIQUES:');
    
    const questionsWithGoto = await Question.find().sort({ code: 1 });
    let totalActiveLinks = 0;
    let questionsWithActiveLinks = 0;

    for (const question of questionsWithGoto) {
      let hasActiveLinks = false;
      
      if (question.options && question.options.length > 0) {
        for (const option of question.options) {
          if (option.goto && option.goto.toString() !== '') {
            if (!hasActiveLinks) {
              hasActiveLinks = true;
              questionsWithActiveLinks++;
              console.log(`\n📝 ${question.code}: "${question.texte.substring(0, 60)}..."`);
            }
            
            const targetQuestion = await Question.findById(option.goto);
            console.log(`   → "${option.libelle}" va vers: ${targetQuestion ? targetQuestion.code : 'INTROUVABLE'}`);
            if (targetQuestion) {
              console.log(`     "${targetQuestion.texte.substring(0, 50)}..."`);
            }
            totalActiveLinks++;
          }
        }
      }
    }

    console.log(`\n📊 STATISTIQUES FINALES:`);
    console.log(`   - Questions avec sauts actifs: ${questionsWithActiveLinks}`);
    console.log(`   - Total des liens de saut actifs: ${totalActiveLinks}`);
    console.log(`   - Total des questions: ${questionsWithGoto.length}`);
    console.log(`   - Pourcentage de questions avec sauts: ${((questionsWithActiveLinks / questionsWithGoto.length) * 100).toFixed(1)}%`);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

addMoreGotoLinks();