/**
 * Script pour identifier et mapper les questions aux tables de référence
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function mapQuestionsToReferenceTables() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('🔗 MAPPING DES QUESTIONS AUX TABLES DE RÉFÉRENCE:\n');

    // Mapping explicite basé sur l'analyse
    const mappings = [
      {
        table: 'District',
        questions: [],
        description: 'Questions sur le district (subdivision administrative)'
      },
      {
        table: 'Region',
        questions: [],
        description: 'Questions sur la région'
      },
      {
        table: 'Departement', 
        questions: [],
        description: 'Questions sur le département'
      },
      {
        table: 'Souspref',
        questions: [],
        description: 'Questions sur la sous-préfecture'
      },
      {
        table: 'Village',
        questions: ['Q012', 'Q022', 'Q046', 'Q050', 'Q086'],
        description: 'Questions sur le village/localité/lieu'
      },
      {
        table: 'Pays',
        questions: ['Q011', 'Q015', 'Q021'],
        description: 'Questions sur le pays'
      },
      {
        table: 'Nationalite',
        questions: [],
        description: 'Questions sur la nationalité'
      },
      {
        table: 'NiveauScolaire',
        questions: ['Q014', 'Q024'],
        description: 'Questions sur le niveau scolaire/formation (Niveau d\'instruction)'
      },
      {
        table: 'Piece',
        questions: ['Q025', 'Q026'],
        description: 'Questions sur les justificatifs d\'identité (pièces)'
      }
    ];

    // Vérifier et afficher les mappings
    for (const mapping of mappings) {
      console.log(`📊 ${mapping.table.toUpperCase()} (${mapping.description}):`);
      
      if (mapping.questions.length > 0) {
        for (const questionCode of mapping.questions) {
          const question = await Question.findOne({ code: questionCode });
          if (question) {
            console.log(`   ✅ ${questionCode}: ${question.texte}`);
            if (question.options && question.options.length > 0) {
              console.log(`      Options: ${question.options.map(o => o.libelle).join(', ')}`);
            }
          } else {
            console.log(`   ❌ ${questionCode}: Question non trouvée`);
          }
        }
      } else {
        console.log('   ⚠️ Aucune question identifiée pour cette table');
      }
      console.log('');
    }

    // Rechercher d'autres questions potentielles
    console.log('🔍 RECHERCHE DE QUESTIONS SUPPLÉMENTAIRES:\n');

    const allQuestions = await Question.find({}).sort({ code: 1 });
    
    // Rechercher des patterns dans les premiers codes (informations administratives)
    const adminQuestions = allQuestions.filter(q => {
      const code = parseInt(q.code.replace('Q', ''));
      return code <= 30; // Les 30 premières questions sont souvent administratives
    });

    console.log('📋 Questions administratives potentielles (Q001-Q030):');
    adminQuestions.forEach(q => {
      const text = q.texte.toLowerCase();
      let potentialTable = null;
      
      if (text.includes('district')) potentialTable = 'District';
      else if (text.includes('région')) potentialTable = 'Region';
      else if (text.includes('département')) potentialTable = 'Departement';
      else if (text.includes('sous-préfecture') || text.includes('préfecture')) potentialTable = 'Souspref';
      else if (text.includes('village') || text.includes('localité') || text.includes('lieu')) potentialTable = 'Village';
      else if (text.includes('pays') || text.includes('origine')) potentialTable = 'Pays';
      else if (text.includes('nationalité')) potentialTable = 'Nationalite';
      else if (text.includes('niveau') || text.includes('instruction') || text.includes('scolaire') || text.includes('formation')) potentialTable = 'NiveauScolaire';
      else if (text.includes('justificatif') || text.includes('pièce') || text.includes('identité')) potentialTable = 'Piece';
      
      if (potentialTable) {
        console.log(`   ${q.code}: ${q.texte} → ${potentialTable}`);
      }
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

mapQuestionsToReferenceTables();