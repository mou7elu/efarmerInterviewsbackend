const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('./models/Question');
const Section = require('./models/Section');

// Connecter à MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected!');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

async function checkData() {
  try {
    // Connecter à la base de données
    await connectDB();
    
    console.log('=== SECTIONS ===');
    const sections = await Section.find({}).limit(5);
    sections.forEach(s => {
      console.log('Section:', s._id.toString(), '- Titre:', s.titre);
    });
    
    console.log('\n=== QUESTIONS (avec sectionId) ===');
    const questions = await Question.find({ sectionId: { $exists: true } }).limit(5);
    questions.forEach(q => {
      console.log('Question:', q.code, '- sectionId:', q.sectionId ? q.sectionId.toString() : 'null');
    });
    
    console.log('\n=== VERIFICATION CORRESPONDANCE ===');
    const firstQuestion = questions[0];
    if (firstQuestion && firstQuestion.sectionId) {
      const correspondingSection = await Section.findById(firstQuestion.sectionId);
      console.log('Question:', firstQuestion.code);
      console.log('sectionId dans question:', firstQuestion.sectionId.toString());
      console.log('Section trouvée:', correspondingSection ? correspondingSection.titre : 'NON TROUVÉE');
    }
    
    // Vérifier toutes les questions avec des sectionId invalides
    console.log('\n=== QUESTIONS AVEC SECTIONS INVALIDES ===');
    const allQuestions = await Question.find({ sectionId: { $exists: true } });
    const allSections = await Section.find({});
    const sectionIds = allSections.map(s => s._id.toString());
    
    let invalidCount = 0;
    for (const question of allQuestions) {
      if (question.sectionId && !sectionIds.includes(question.sectionId.toString())) {
        console.log('Question invalide:', question.code, '- sectionId:', question.sectionId.toString());
        invalidCount++;
      }
    }
    
    console.log(`\nTotal questions avec sections invalides: ${invalidCount}`);
    console.log(`Total sections disponibles: ${allSections.length}`);
    console.log(`Total questions avec sectionId: ${allQuestions.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

checkData();