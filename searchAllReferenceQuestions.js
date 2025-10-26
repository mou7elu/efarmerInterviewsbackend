/**
 * Script pour chercher toutes les questions de référence
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function searchAllReferenceQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    const questions = await Question.find({}).sort({ code: 1 });
    
    console.log('🔍 RECHERCHE DES QUESTIONS DE RÉFÉRENCE:\n');
    
    const keywords = ['district', 'région', 'département', 'préfecture', 'village', 'pays', 'nationalité', 'instruction', 'identité', 'scolaire', 'diplôme', 'étude', 'formation', 'résidence', 'localité', 'origine'];
    
    const foundQuestions = [];
    
    questions.forEach(q => {
      const found = keywords.some(keyword => q.texte.toLowerCase().includes(keyword));
      if (found) {
        foundQuestions.push(q);
        console.log(`${q.code}: ${q.texte}`);
        if (q.options && q.options.length > 0) {
          console.log(`  Options: ${q.options.map(o => o.libelle).join(', ')}`);
        }
        console.log('');
      }
    });

    console.log(`\n📊 Total: ${foundQuestions.length} questions trouvées\n`);

    // Rechercher aussi par code pour les questions géographiques typiques
    console.log('🌍 RECHERCHE PAR PATTERN DE CODES:\n');
    
    const geoQuestions = await Question.find({
      code: { 
        $in: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q008', 'Q009', 'Q010', 'Q011', 'Q012', 'Q013', 'Q015', 'Q016', 'Q017', 'Q018', 'Q019', 'Q020', 'Q021', 'Q022', 'Q023', 'Q025', 'Q026', 'Q027', 'Q028', 'Q029', 'Q030']
      }
    }).sort({ code: 1 });
    
    geoQuestions.forEach(q => {
      console.log(`${q.code}: ${q.texte}`);
      if (q.options && q.options.length > 0) {
        console.log(`  Options: ${q.options.map(o => o.libelle).join(', ')}`);
      }
      console.log('');
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

searchAllReferenceQuestions();