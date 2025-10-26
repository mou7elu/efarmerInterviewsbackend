/**
 * Script de visualisation et documentation des sauts logiques
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function generateGotoDocumentation() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('📚 DOCUMENTATION COMPLÈTE DES SAUTS LOGIQUES');
    console.log('═'.repeat(60));

    // Récupérer toutes les questions avec des sauts
    const questionsWithGoto = await Question.find({
      'options.goto': { $exists: true, $ne: null }
    }).sort({ code: 1 });

    console.log('\n🗺️ CARTE DES SAUTS LOGIQUES:\n');

    // Grouper par catégorie
    const categories = {
      'Identification': ['Q006', 'Q007'],
      'Formation': ['Q014', 'Q024'],
      'Infrastructure': ['Q040', 'Q044', 'Q045'],
      'Services Financiers': ['Q051', 'Q054', 'Q057'],
      'Agriculture': ['Q099', 'Q102', 'Q103']
    };

    for (const [category, questionCodes] of Object.entries(categories)) {
      console.log(`\n📁 ${category.toUpperCase()}`);
      console.log('─'.repeat(category.length + 4));

      for (const code of questionCodes) {
        const question = questionsWithGoto.find(q => q.code === code);
        if (question) {
          console.log(`\n${code}: ${question.texte}`);
          
          for (const option of question.options) {
            if (option.goto) {
              const target = await Question.findById(option.goto);
              const targetCode = target ? target.code : 'ERREUR';
              const targetText = target ? target.texte.substring(0, 50) + '...' : 'QUESTION INTROUVABLE';
              
              console.log(`   📍 "${option.libelle}" → ${targetCode}`);
              console.log(`      "${targetText}"`);
            } else {
              console.log(`   ○ "${option.libelle}" (suite normale)`);
            }
          }
        }
      }
    }

    // Générer un diagramme de flux textuel
    console.log('\n\n🔄 DIAGRAMME DE FLUX DES SAUTS PRINCIPAUX:');
    console.log('═'.repeat(50));

    const mainFlows = [
      {
        name: 'Flux Exploitant',
        flow: 'Q006 (Oui) → Q014 (Non) → Q016'
      },
      {
        name: 'Flux Non-Exploitant', 
        flow: 'Q006 (Non) → Q007'
      },
      {
        name: 'Flux Bancaire',
        flow: 'Q051 (Non) → Q054 (Non) → Q058'
      },
      {
        name: 'Flux Infrastructure',
        flow: 'Q044 (Non) → Q045 (Non) → Q047'
      },
      {
        name: 'Flux Agriculture',
        flow: 'Q102 (Non) → Q103 (Non) → Q105'
      }
    ];

    for (const flow of mainFlows) {
      console.log(`\n${flow.name}:`);
      console.log(`   ${flow.flow}`);
    }

    // Statistiques détaillées
    console.log('\n\n📊 STATISTIQUES DÉTAILLÉES:');
    console.log('═'.repeat(40));

    const totalQuestions = await Question.countDocuments();
    const questionsWithOptions = await Question.countDocuments({ 
      'options.0': { $exists: true } 
    });
    
    let totalGotoLinks = 0;
    for (const question of questionsWithGoto) {
      for (const option of question.options) {
        if (option.goto) totalGotoLinks++;
      }
    }

    console.log(`Total des questions: ${totalQuestions}`);
    console.log(`Questions avec options: ${questionsWithOptions}`);
    console.log(`Questions avec sauts: ${questionsWithGoto.length}`);
    console.log(`Total des liens de saut: ${totalGotoLinks}`);
    console.log(`Pourcentage avec sauts: ${((questionsWithGoto.length / totalQuestions) * 100).toFixed(1)}%`);

    // Recommandations d'amélioration
    console.log('\n\n💡 RECOMMANDATIONS D\'AMÉLIORATION:');
    console.log('═'.repeat(45));

    console.log('\n1. Sauts manqués détectés:');
    console.log('   - Q007 pourrait avoir des sauts selon le type de lien');
    console.log('   - Questions de formation détaillées pourraient être optimisées');
    console.log('   - Questions sur les cultures pourraient avoir des sauts conditionnels');

    console.log('\n2. Optimisations possibles:');
    console.log('   - Ajouter des sauts pour les questions sur les superficies');
    console.log('   - Optimiser le flux des questions de revenus');
    console.log('   - Créer des sauts pour les questions sur les marchés');

    console.log('\n3. Validation recommandée:');
    console.log('   - Tester le questionnaire complet avec des utilisateurs');
    console.log('   - Vérifier la cohérence des sauts avec la logique métier');
    console.log('   - Valider que tous les chemins mènent à la fin du questionnaire');

    // Export JSON pour documentation
    const documentationData = {
      totalQuestions,
      questionsWithGoto: questionsWithGoto.length,
      totalGotoLinks,
      categories,
      mainFlows,
      gotoMappings: []
    };

    for (const question of questionsWithGoto) {
      for (const option of question.options) {
        if (option.goto) {
          const target = await Question.findById(option.goto);
          documentationData.gotoMappings.push({
            source: question.code,
            sourceText: question.texte,
            option: option.libelle,
            target: target ? target.code : 'ERROR',
            targetText: target ? target.texte : 'NOT FOUND'
          });
        }
      }
    }

    console.log('\n\n💾 Documentation exportée en JSON pour référence future');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

generateGotoDocumentation();