/**
 * Script d'analyse intelligente pour détecter automatiquement 
 * les opportunités de sauts logiques
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function analyzeQuestionsForGoto() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    const questions = await Question.find().sort({ code: 1 });
    
    console.log('\n🔍 ANALYSE INTELLIGENTE DES SAUTS LOGIQUES POSSIBLES:\n');
    
    const suggestions = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Analyser seulement les questions avec options
      if (!question.options || question.options.length === 0) continue;

      const questionText = question.texte.toLowerCase();
      
      // Patterns à analyser
      const patterns = [
        {
          test: /avez-vous|possédez-vous|êtes-vous/,
          expectedOptions: ['oui', 'non'],
          skipCondition: 'non',
          skipDistance: 1,
          reason: 'Question Oui/Non - possibilité de sauter détails si Non'
        },
        {
          test: /formation|étude|diplôme/,
          expectedOptions: ['oui', 'non'],
          skipCondition: 'non', 
          skipDistance: 2,
          reason: 'Question formation - sauter détails si pas de formation'
        },
        {
          test: /compte|bancaire|banque/,
          expectedOptions: ['oui', 'non'],
          skipCondition: 'non',
          skipDistance: 3,
          reason: 'Question bancaire - sauter services bancaires si pas de compte'
        },
        {
          test: /internet|mobile|téléphone/,
          expectedOptions: ['oui', 'non'],
          skipCondition: 'non',
          skipDistance: 1,
          reason: 'Question technologie - sauter usage si pas d\'accès'
        },
        {
          test: /stockage|magasin|entrepôt/,
          expectedOptions: ['oui', 'non'],
          skipCondition: 'non',
          skipDistance: 2,
          reason: 'Question stockage - sauter détails si pas de stockage'
        }
      ];

      for (const pattern of patterns) {
        if (pattern.test.test(questionText)) {
          // Vérifier si la question a les options attendues
          const hasExpectedOptions = pattern.expectedOptions.every(expectedOpt => 
            question.options.some(opt => 
              opt.libelle.toLowerCase().includes(expectedOpt)
            )
          );

          if (hasExpectedOptions) {
            // Trouver l'option de saut
            const skipOption = question.options.find(opt => 
              opt.libelle.toLowerCase().includes(pattern.skipCondition)
            );

            if (skipOption && !skipOption.goto) {
              // Calculer la question cible
              const currentIndex = questions.findIndex(q => q._id.toString() === question._id.toString());
              const targetIndex = currentIndex + pattern.skipDistance;
              
              if (targetIndex < questions.length) {
                const targetQuestion = questions[targetIndex];
                
                suggestions.push({
                  source: question.code,
                  sourceText: question.texte,
                  option: skipOption.libelle,
                  target: targetQuestion.code,
                  targetText: targetQuestion.texte,
                  reason: pattern.reason,
                  confidence: 'ÉLEVÉE'
                });
              }
            }
          }
        }
      }

      // Analyse contextuelle avancée
      if (questionText.includes('exploitant')) {
        const nextQuestions = questions.slice(i + 1, i + 10);
        const formationQuestion = nextQuestions.find(q => 
          q.texte.toLowerCase().includes('formation') && 
          q.options && q.options.length > 0
        );
        
        if (formationQuestion) {
          const ouiOption = question.options.find(opt => 
            opt.libelle.toLowerCase().includes('oui')
          );
          
          if (ouiOption && !ouiOption.goto) {
            suggestions.push({
              source: question.code,
              sourceText: question.texte,
              option: ouiOption.libelle,
              target: formationQuestion.code,
              targetText: formationQuestion.texte,
              reason: 'Si exploitant → aller aux questions spécifiques exploitant',
              confidence: 'MOYENNE'
            });
          }
        }
      }
    }

    // Afficher les suggestions
    console.log(`${suggestions.length} sauts logiques suggérés:\n`);
    
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.source} → ${suggestion.target} [${suggestion.confidence}]`);
      console.log(`   Question: "${suggestion.sourceText.substring(0, 60)}..."`);
      console.log(`   Option: "${suggestion.option}"`);
      console.log(`   Vers: "${suggestion.targetText.substring(0, 60)}..."`);
      console.log(`   Raison: ${suggestion.reason}`);
      console.log('');
    });

    // Créer un script d'application automatique
    console.log('\n📝 SCRIPT POUR APPLIQUER CES SUGGESTIONS:');
    console.log('\nconst suggestedMappings = [');
    
    suggestions.forEach(suggestion => {
      console.log(`  {`);
      console.log(`    source: '${suggestion.source}',`);
      console.log(`    condition: '${suggestion.option}',`);
      console.log(`    target: '${suggestion.target}',`);
      console.log(`    description: '${suggestion.reason}'`);
      console.log(`  },`);
    });
    
    console.log('];');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

analyzeQuestionsForGoto();