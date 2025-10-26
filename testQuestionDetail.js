const fetch = require('node-fetch');

async function testQuestionDetail() {
  try {
    console.log('=== TEST QUESTION DETAIL ===');
    
    // Récupérer une question spécifique
    const response = await fetch('http://localhost:5001/api/questionnaire/questions/68f50c25fd9b13ce3a4d91c9');
    const question = await response.json();
    
    console.log('Question récupérée:');
    console.log('- Code:', question.code);
    console.log('- Texte:', question.texte.substring(0, 50) + '...');
    console.log('- Type:', question.type);
    console.log('- Obligatoire:', question.obligatoire);
    console.log('- Unité:', question.unite);
    console.log('\n- Section:');
    console.log('  - Type:', typeof question.sectionId);
    console.log('  - Données:', question.sectionId);
    console.log('\n- Volet:');
    console.log('  - Type:', typeof question.voletId);
    console.log('  - Données:', question.voletId);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testQuestionDetail();