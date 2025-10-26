/**
 * Script pour identifier les questions liées aux tables de référence
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function findReferenceQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Rechercher les questions liées aux entités géographiques/administratives
    const questions = await Question.find({
      $or: [
        { texte: /district/i },
        { texte: /région/i },
        { texte: /département/i },
        { texte: /sous.préfecture/i },
        { texte: /village/i },
        { texte: /pays/i },
        { texte: /nationalité/i },
        { texte: /niveau.*instruction/i },
        { texte: /justificatif.*identité/i },
        { texte: /niveau.*scolaire/i },
        { texte: /pièce.*identité/i },
        { texte: /origine/i },
        { texte: /localité/i },
        { texte: /résidence/i },
        { texte: /formation/i }
      ]
    }).sort({ code: 1 });

    console.log('\n📍 QUESTIONS AVEC RÉFÉRENCES GÉOGRAPHIQUES/ADMINISTRATIVES:\n');

    const mappings = {
      'District': [],
      'Région': [],
      'Département': [],
      'Sous-préfecture': [],
      'Village': [],
      'Pays': [],
      'Nationalité': [],
      'Niveau scolaire': [],
      'Pièce d\'identité': []
    };

    questions.forEach(q => {
      console.log(`${q.code}: ${q.texte}`);
      if (q.options && q.options.length > 0) {
        console.log(`  Options: ${q.options.map(o => o.libelle).join(', ')}`);
      }
      
      // Catégoriser les questions
      const text = q.texte.toLowerCase();
      if (text.includes('district')) mappings['District'].push(q);
      if (text.includes('région')) mappings['Région'].push(q);
      if (text.includes('département')) mappings['Département'].push(q);
      if (text.includes('sous-préfecture') || text.includes('sous préfecture')) mappings['Sous-préfecture'].push(q);
      if (text.includes('village') || text.includes('localité')) mappings['Village'].push(q);
      if (text.includes('pays') || text.includes('origine')) mappings['Pays'].push(q);
      if (text.includes('nationalité')) mappings['Nationalité'].push(q);
      if (text.includes('niveau') && (text.includes('instruction') || text.includes('scolaire') || text.includes('étude'))) mappings['Niveau scolaire'].push(q);
      if (text.includes('justificatif') || text.includes('pièce')) mappings['Pièce d\'identité'].push(q);
      
      console.log('');
    });

    console.log('\n🔗 MAPPING PROPOSÉ AVEC LES TABLES DE RÉFÉRENCE:\n');

    for (const [table, questions] of Object.entries(mappings)) {
      if (questions.length > 0) {
        console.log(`📊 ${table.toUpperCase()}:`);
        questions.forEach(q => {
          console.log(`   ${q.code}: ${q.texte}`);
        });
        console.log('');
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

findReferenceQuestions();