/**
 * Script pour mettre à jour les questions avec les références aux tables
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function updateQuestionsWithReferences() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('🔄 MISE À JOUR DES QUESTIONS AVEC RÉFÉRENCES AUX TABLES:\n');

    // Définir les mappings précis
    const questionMappings = [
      // Village/Localité
      {
        codes: ['Q012', 'Q022'],
        referenceTable: 'Village',
        referenceField: 'Lib_village',
        description: 'Lieu de naissance → Table Village'
      },
      {
        codes: ['Q086'],
        referenceTable: 'Village',
        referenceField: 'Lib_village',
        description: 'Localité exploitation → Table Village'
      },
      
      // Pays
      {
        codes: ['Q011', 'Q015', 'Q021'],
        referenceTable: 'Pays',
        referenceField: 'Lib_pays',
        description: 'Pays de naissance/origine → Table Pays'
      },
      
      // Niveau Scolaire (Formation)
      {
        codes: ['Q014', 'Q024'],
        referenceTable: 'NiveauScolaire',
        referenceField: 'Lib_NiveauScolaire',
        description: 'Formation agricole → Table NiveauScolaire'
      },
      
      // Pièce d'identité
      {
        codes: ['Q025', 'Q026'],
        referenceTable: 'Piece',
        referenceField: 'Nom_piece',
        description: 'Justificatif d\'identité → Table Piece'
      }
    ];

    let totalUpdated = 0;

    for (const mapping of questionMappings) {
      console.log(`📝 ${mapping.description}`);
      
      for (const code of mapping.codes) {
        const question = await Question.findOne({ code });
        
        if (question) {
          // Mettre à jour seulement si pas déjà défini
          if (!question.referenceTable) {
            question.referenceTable = mapping.referenceTable;
            question.referenceField = mapping.referenceField;
            await question.save();
            totalUpdated++;
            console.log(`   ✅ ${code}: ${question.texte}`);
            console.log(`      → ${mapping.referenceTable}.${mapping.referenceField}`);
          } else {
            console.log(`   ⚠️ ${code}: Déjà configuré (${question.referenceTable})`);
          }
        } else {
          console.log(`   ❌ ${code}: Question non trouvée`);
        }
      }
      console.log('');
    }

    console.log(`🎉 ${totalUpdated} questions mises à jour avec succès !`);

    // Vérification finale
    console.log('\n🔍 VÉRIFICATION DES QUESTIONS AVEC RÉFÉRENCES:\n');
    
    const questionsWithRefs = await Question.find({
      referenceTable: { $exists: true, $ne: null }
    }).sort({ code: 1 });

    const refGroups = {};
    questionsWithRefs.forEach(q => {
      if (!refGroups[q.referenceTable]) {
        refGroups[q.referenceTable] = [];
      }
      refGroups[q.referenceTable].push(q);
    });

    for (const [table, questions] of Object.entries(refGroups)) {
      console.log(`📊 ${table.toUpperCase()}:`);
      questions.forEach(q => {
        console.log(`   ${q.code}: ${q.texte}`);
        console.log(`   → ${q.referenceTable}.${q.referenceField}`);
      });
      console.log('');
    }

    console.log(`📈 STATISTIQUES:`);
    console.log(`   - Questions avec références: ${questionsWithRefs.length}`);
    console.log(`   - Tables de référence utilisées: ${Object.keys(refGroups).length}`);

    // Suggestions pour les tables manquantes
    console.log('\n💡 TABLES NON UTILISÉES (à implémenter si nécessaire):');
    const allTables = ['District', 'Region', 'Departement', 'Souspref', 'Nationalite'];
    const usedTables = Object.keys(refGroups);
    const unusedTables = allTables.filter(table => !usedTables.includes(table));
    
    unusedTables.forEach(table => {
      console.log(`   ⚪ ${table} - Aucune question identifiée`);
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

updateQuestionsWithReferences();