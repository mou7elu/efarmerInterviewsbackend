/**
 * Script pour vérifier la structure réelle des données dans MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function checkDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Récupérer quelques questions avec leurs options
    console.log('\n🔍 STRUCTURE BRUTE DES DONNÉES:');
    
    const questions = await Question.find({}).limit(10);
    
    for (const question of questions) {
      console.log(`\n📝 ${question.code}: ${question.texte}`);
      console.log(`   Type: ${question.type}`);
      console.log(`   Options (raw):`, JSON.stringify(question.options, null, 2));
      console.log(`   Options length: ${question.options ? question.options.length : 'undefined'}`);
    }

    // Vérifier spécifiquement les questions Oui/Non
    console.log('\n\n🔍 QUESTIONS AVEC "OUI" DANS LE TEXTE:');
    const yesNoQuestions = await Question.find({
      texte: { $regex: /êtes|avez/i }
    }).limit(5);

    for (const question of yesNoQuestions) {
      console.log(`\n📝 ${question.code}: ${question.texte}`);
      console.log(`   Options array:`, question.options);
      console.log(`   Options exists: ${question.options !== undefined}`);
      console.log(`   Options is array: ${Array.isArray(question.options)}`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

checkDatabase();