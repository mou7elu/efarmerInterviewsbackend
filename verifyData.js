/**
 * Script de vérification des données importées
 */

require('dotenv').config();
const mongoose = require('mongoose');
const {
  Questionnaire,
  Volet,
  Section,
  Question
} = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function verifyData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Compter les données
    const questionnaireCount = await Questionnaire.countDocuments();
    const voletCount = await Volet.countDocuments();
    const sectionCount = await Section.countDocuments();
    const questionCount = await Question.countDocuments();

    console.log('\n📊 STATISTIQUES:');
    console.log(`Questionnaires: ${questionnaireCount}`);
    console.log(`Volets: ${voletCount}`);
    console.log(`Sections: ${sectionCount}`);
    console.log(`Questions: ${questionCount}`);

    // Afficher quelques exemples de questions
    console.log('\n📝 EXEMPLES DE QUESTIONS:');
    const sampleQuestions = await Question.find().limit(5);
    sampleQuestions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.code}: ${q.texte}`);
      console.log(`   Type: ${q.type}`);
      if (q.options && q.options.length > 0) {
        console.log(`   Options: ${q.options.map(opt => opt.libelle).join(', ')}`);
      }
      console.log('');
    });

    // Afficher la structure des volets
    console.log('\n🗂️ STRUCTURE DES VOLETS:');
    const volets = await Volet.find().populate('questionnaireId');
    for (const volet of volets) {
      console.log(`📁 ${volet.titre}`);
      const sections = await Section.find({ voletId: volet._id });
      for (const section of sections) {
        const questionsInSection = await Question.countDocuments({ sectionId: section._id });
        console.log(`  📄 ${section.titre} (${questionsInSection} questions)`);
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

verifyData();