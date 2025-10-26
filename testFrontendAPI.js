const fetch = require('node-fetch');

async function testFrontendAPI() {
  try {
    console.log('=== TEST API FRONTEND ===');
    
    // Test des questions
    const questionsResponse = await fetch('http://localhost:5001/api/questionnaire/questions');
    const questions = await questionsResponse.json();
    console.log('✅ Questions récupérées:', questions.length);
    
    // Test des sections  
    const sectionsResponse = await fetch('http://localhost:5001/api/questionnaire/sections');
    const sections = await sectionsResponse.json();
    console.log('✅ Sections récupérées:', sections.length);
    
    // Test des volets
    const voletsResponse = await fetch('http://localhost:5001/api/questionnaire/volets');
    const volets = await voletsResponse.json();
    console.log('✅ Volets récupérés:', volets.length);
    
    console.log('\n=== EXEMPLE DE DONNÉES ===');
    if (questions.length > 0) {
      const q = questions[0];
      console.log('Question exemple:');
      console.log('- Code:', q.code);
      console.log('- Texte:', q.texte.substring(0, 50) + '...');
      console.log('- Type:', q.type);
      console.log('- Obligatoire:', q.obligatoire);
      console.log('- Unité:', q.unite);
      console.log('- Section ID:', q.sectionId ? (typeof q.sectionId === 'object' ? q.sectionId._id : q.sectionId) : 'null');
      console.log('- Section Titre:', q.sectionId && typeof q.sectionId === 'object' ? q.sectionId.titre : 'Non populé');
      console.log('- Volet ID:', q.voletId ? (typeof q.voletId === 'object' ? q.voletId._id : q.voletId) : 'null');
      console.log('- Volet Titre:', q.voletId && typeof q.voletId === 'object' ? q.voletId.titre : 'Non populé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testFrontendAPI();