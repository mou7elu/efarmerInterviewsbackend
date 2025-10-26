/**
 * RÉSUMÉ COMPLET DES RELATIONS QUESTIONNAIRE ↔ TABLES DE RÉFÉRENCE
 * ================================================================
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question, Pays, Village, NiveauScolaire, Piece, Nationalite } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function generateReferenceTablesReport() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('📋 RAPPORT COMPLET - RELATIONS QUESTIONNAIRE ↔ TABLES DE RÉFÉRENCE');
    console.log('═'.repeat(80));

    // 1. Questions avec références
    const questionsWithRefs = await Question.find({
      referenceTable: { $exists: true, $ne: null }
    }).sort({ code: 1 });

    console.log('\n🔗 QUESTIONS LIÉES AUX TABLES DE RÉFÉRENCE:\n');

    const refGroups = {};
    questionsWithRefs.forEach(q => {
      if (!refGroups[q.referenceTable]) {
        refGroups[q.referenceTable] = [];
      }
      refGroups[q.referenceTable].push(q);
    });

    for (const [table, questions] of Object.entries(refGroups)) {
      console.log(`📊 ${table.toUpperCase()}:`);
      const tableStats = await mongoose.model(table).countDocuments();
      console.log(`   📈 ${tableStats} entrées disponibles dans la table`);
      
      questions.forEach(q => {
        console.log(`   ${q.code}: ${q.texte}`);
        console.log(`   → Champ: ${q.referenceField}`);
        if (q.options && q.options.length > 0) {
          console.log(`   → Options: ${q.options.map(o => o.libelle).join(', ')}`);
        }
      });
      console.log('');
    }

    // 2. Correspondances établies
    console.log('🎯 CORRESPONDANCES FINALES ÉTABLIES:\n');
    
    const mappingsSummary = [
      {
        description: 'District dans le questionnaire',
        table: 'District',
        status: '❌ Aucune question identifiée',
        note: 'À implémenter si nécessaire'
      },
      {
        description: 'Région dans le questionnaire', 
        table: 'Region',
        status: '❌ Aucune question identifiée',
        note: 'À implémenter si nécessaire'
      },
      {
        description: 'Département dans le questionnaire',
        table: 'Departement', 
        status: '❌ Aucune question identifiée',
        note: 'À implémenter si nécessaire'
      },
      {
        description: 'Sous-préfecture dans le questionnaire',
        table: 'Souspref',
        status: '❌ Aucune question identifiée', 
        note: 'À implémenter si nécessaire'
      },
      {
        description: 'Village dans le questionnaire',
        table: 'Village',
        status: '✅ Lié à la table Village',
        questions: ['Q012', 'Q022', 'Q086'],
        note: 'Lieu de naissance et localité exploitation'
      },
      {
        description: 'Pays dans le questionnaire',
        table: 'Pays', 
        status: '✅ Lié à la table Pays',
        questions: ['Q011', 'Q015', 'Q021'],
        note: 'Pays de naissance et origine'
      },
      {
        description: 'Nationalité dans le questionnaire',
        table: 'Nationalite',
        status: '❌ Aucune question identifiée',
        note: 'Pourrait être ajouté dans une future version'
      },
      {
        description: 'Niveau d\'instruction dans le questionnaire',
        table: 'NiveauScolaire',
        status: '✅ Lié à la table NiveauScolaire', 
        questions: ['Q014', 'Q024'],
        note: 'Questions sur la formation agricole'
      },
      {
        description: 'Justificatif d\'identité dans le questionnaire',
        table: 'Piece',
        status: '✅ Lié à la table Piece',
        questions: ['Q025', 'Q026'], 
        note: 'Pièces d\'identité et justificatifs'
      }
    ];

    mappingsSummary.forEach(mapping => {
      console.log(`${mapping.status} ${mapping.description}`);
      console.log(`   Table: ${mapping.table}`);
      if (mapping.questions) {
        console.log(`   Questions: ${mapping.questions.join(', ')}`);
      }
      console.log(`   Note: ${mapping.note}`);
      console.log('');
    });

    // 3. Statistiques globales
    console.log('📊 STATISTIQUES GLOBALES:');
    console.log('─'.repeat(50));
    
    const totalQuestions = await Question.countDocuments();
    const questionsWithOptions = await Question.countDocuments({ 'options.0': { $exists: true } });
    const questionsWithReferences = questionsWithRefs.length;
    
    console.log(`📝 Total questions: ${totalQuestions}`);
    console.log(`🔘 Questions avec options: ${questionsWithOptions}`);
    console.log(`🔗 Questions avec références: ${questionsWithReferences}`);
    console.log(`📈 Pourcentage avec références: ${((questionsWithReferences / totalQuestions) * 100).toFixed(1)}%`);
    
    // Tables de référence peuplées
    const tableStats = [
      { name: 'Pays', count: await Pays.countDocuments() },
      { name: 'Village', count: await Village.countDocuments() },
      { name: 'NiveauScolaire', count: await NiveauScolaire.countDocuments() },
      { name: 'Piece', count: await Piece.countDocuments() },
      { name: 'Nationalite', count: await Nationalite.countDocuments() }
    ];
    
    console.log('\n📚 Tables de référence peuplées:');
    tableStats.forEach(table => {
      console.log(`   ${table.name}: ${table.count} entrées`);
    });

    // 4. Recommandations
    console.log('\n💡 RECOMMANDATIONS POUR LE DÉVELOPPEMENT:');
    console.log('─'.repeat(55));
    
    console.log('\n1. FRONTEND - Interface utilisateur:');
    console.log('   - Créer des composants de sélection pour chaque table de référence');
    console.log('   - Implémenter des dropdown/autocomplete pour les questions liées');
    console.log('   - Gérer la validation des sélections');
    
    console.log('\n2. API - Endpoints à créer:');
    console.log('   - GET /api/reference/pays - Liste des pays');
    console.log('   - GET /api/reference/villages - Liste des villages');
    console.log('   - GET /api/reference/niveaux-scolaires - Niveaux d\'instruction');
    console.log('   - GET /api/reference/pieces - Types de pièces d\'identité');
    
    console.log('\n3. VALIDATION - Côté serveur:');
    console.log('   - Vérifier que les valeurs sélectionnées existent dans les tables');
    console.log('   - Implémenter des middlewares de validation');
    console.log('   - Gérer les cas d\'erreur de référence');

    console.log('\n4. EXTENSIBILITÉ:');
    console.log('   - Prévoir l\'ajout de District, Région, Département si nécessaire');
    console.log('   - Implémenter des questions sur la nationalité');
    console.log('   - Considérer des questions géographiques supplémentaires');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

generateReferenceTablesReport();