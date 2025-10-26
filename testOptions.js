/**
 * Script pour tester la détection améliorée des options
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function testOptions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Chercher des questions avec des options spéciales
    console.log('\n🔍 QUESTIONS AVEC OPTIONS DÉTECTÉES:');
    
    const questionsWithOptions = await Question.find({
      'options.0': { $exists: true }
    }).limit(20);

    for (const question of questionsWithOptions) {
      console.log(`\n📝 ${question.code}: ${question.texte}`);
      console.log(`   Type: ${question.type}`);
      console.log('   Options:');
      
      for (const option of question.options) {
        console.log(`      - ${option.libelle} (valeur: ${option.valeur})`);
        if (option.gotoTarget) {
          console.log(`        → Goto: ${option.gotoTarget}`);
        }
        if (option.gotoQuestionId) {
          console.log(`        → Linked to: ${option.gotoQuestionId}`);
        }
      }
    }

    // Chercher spécifiquement les questions boolean (Oui/Non)
    console.log('\n\n🔍 QUESTIONS DE TYPE BOOLEAN:');
    const booleanQuestions = await Question.find({ type: 'boolean' });
    
    for (const question of booleanQuestions) {
      console.log(`\n📝 ${question.code}: ${question.texte}`);
      console.log('   Options:');
      for (const option of question.options) {
        console.log(`      - ${option.libelle}`);
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

testOptions();