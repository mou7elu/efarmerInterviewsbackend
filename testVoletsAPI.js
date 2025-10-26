const fetch = require('node-fetch');

async function testVoletsAPI() {
  try {
    console.log('=== TEST VOLETS API ===');
    
    const response = await fetch('http://localhost:5001/api/questionnaire/volets');
    const volets = await response.json();
    
    console.log('Nombre de volets:', volets.length);
    if (volets.length > 0) {
      const firstVolet = volets[0];
      console.log('\nPremier volet:');
      console.log('- ID:', firstVolet._id);
      console.log('- Titre:', firstVolet.titre);
      console.log('- Ordre:', firstVolet.ordre);
      console.log('- questionnaireId type:', typeof firstVolet.questionnaireId);
      console.log('- questionnaireId données:', firstVolet.questionnaireId);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testVoletsAPI();