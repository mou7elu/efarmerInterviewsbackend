/**
 * Script de test complet pour valider tous les sauts logiques
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function testAllGotoLogic() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('🧪 TEST COMPLET DE LA LOGIQUE DE SAUTS\n');

    // Scénarios de test
    const testScenarios = [
      {
        name: 'Répondant NON-exploitant',
        path: [
          { question: 'Q006', response: 'Non', expectedNext: 'Q007' },
          { question: 'Q007', response: 'Propriétaire', expectedNext: 'Q008' }
        ]
      },
      {
        name: 'Exploitant AVEC formation',
        path: [
          { question: 'Q006', response: 'Oui', expectedNext: 'Q014' },
          { question: 'Q014', response: 'Oui', expectedNext: 'Q015' }
        ]
      },
      {
        name: 'Exploitant SANS formation',
        path: [
          { question: 'Q006', response: 'Oui', expectedNext: 'Q014' },
          { question: 'Q014', response: 'Non', expectedNext: 'Q016' }
        ]
      },
      {
        name: 'Pas de compte bancaire → Mobile Money',
        path: [
          { question: 'Q051', response: 'Non', expectedNext: 'Q054' },
          { question: 'Q054', response: 'Non', expectedNext: 'Q058' }
        ]
      },
      {
        name: 'Pas d\'accès Internet ni santé',
        path: [
          { question: 'Q044', response: 'Non', expectedNext: 'Q045' },
          { question: 'Q045', response: 'Non', expectedNext: 'Q047' }
        ]
      },
      {
        name: 'Pas de stockage',
        path: [
          { question: 'Q040', response: 'Non', expectedNext: 'Q042' }
        ]
      },
      {
        name: 'Pas de conseils agricoles',
        path: [
          { question: 'Q099', response: 'Non', expectedNext: 'Q101' }
        ]
      },
      {
        name: 'Pas d\'engrais ni traitements',
        path: [
          { question: 'Q102', response: 'Non', expectedNext: 'Q103' },
          { question: 'Q103', response: 'Non', expectedNext: 'Q105' }
        ]
      }
    ];

    let totalTests = 0;
    let passedTests = 0;

    for (const scenario of testScenarios) {
      console.log(`\n🎯 SCÉNARIO: ${scenario.name}`);
      console.log('─'.repeat(50));

      for (const step of scenario.path) {
        totalTests++;
        
        // Récupérer la question
        const question = await Question.findOne({ code: step.question });
        if (!question) {
          console.log(`   ❌ Question ${step.question} non trouvée`);
          continue;
        }

        console.log(`\n📝 ${step.question}: "${question.texte.substring(0, 60)}..."`);
        console.log(`   Réponse: "${step.response}"`);

        // Trouver l'option correspondante
        const option = question.options.find(opt => 
          opt.libelle.toLowerCase().includes(step.response.toLowerCase()) ||
          opt.valeur.toLowerCase().includes(step.response.toLowerCase())
        );

        if (!option) {
          console.log(`   ❌ Option "${step.response}" non trouvée`);
          console.log(`   📋 Options disponibles: ${question.options.map(o => `"${o.libelle}"`).join(', ')}`);
          continue;
        }

        // Vérifier le saut
        if (option.goto) {
          const targetQuestion = await Question.findById(option.goto);
          const actualNext = targetQuestion ? targetQuestion.code : 'INTROUVABLE';
          
          if (actualNext === step.expectedNext) {
            passedTests++;
            console.log(`   ✅ Saut correct: "${option.libelle}" → ${actualNext}`);
            console.log(`      "${targetQuestion.texte.substring(0, 50)}..."`);
          } else {
            console.log(`   ❌ Saut incorrect: "${option.libelle}" → ${actualNext} (attendu: ${step.expectedNext})`);
          }
        } else {
          // Pas de saut défini - vérifier si c'est normal
          const nextQuestion = await Question.findOne({ 
            code: step.expectedNext 
          });
          
          if (nextQuestion) {
            console.log(`   ⚠️ Pas de saut défini mais devrait aller vers ${step.expectedNext}`);
            console.log(`      Comportement par défaut: question suivante`);
          } else {
            console.log(`   ❌ Question cible ${step.expectedNext} non trouvée`);
          }
        }
      }
    }

    console.log('\n📊 RÉSULTATS DES TESTS:');
    console.log('═'.repeat(50));
    console.log(`Tests réussis: ${passedTests}/${totalTests}`);
    console.log(`Taux de réussite: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);

    if (passedTests === totalTests) {
      console.log('🎉 TOUS LES TESTS SONT RÉUSSIS !');
    } else {
      console.log('⚠️ Certains tests ont échoué - vérification nécessaire');
    }

    // Génération d'un rapport détaillé
    console.log('\n📋 RAPPORT DÉTAILLÉ DES SAUTS LOGIQUES:');
    console.log('═'.repeat(50));

    const allQuestions = await Question.find({ 
      'options.goto': { $exists: true, $ne: null } 
    }).sort({ code: 1 });

    for (const question of allQuestions) {
      console.log(`\n${question.code}: ${question.texte}`);
      
      for (const option of question.options) {
        if (option.goto) {
          const target = await Question.findById(option.goto);
          console.log(`   "${option.libelle}" → ${target ? target.code : 'ERREUR'}`);
        }
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

testAllGotoLogic();