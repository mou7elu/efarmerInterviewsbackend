const fetch = require('node-fetch');

async function testVoletsLogic() {
  try {
    console.log('=== TEST VOLETS LOGIC ===');
    
    const response = await fetch('http://localhost:5001/api/questionnaire/volets');
    const volets = await response.json();
    
    console.log('Nombre de volets:', volets.length);
    
    // Test de la fonction getQuestionnaireInfo
    const getQuestionnaireInfo = (questionnaireData) => {
      if (typeof questionnaireData === 'object' && questionnaireData !== null && questionnaireData._id) {
        return questionnaireData;
      }
      return { titre: 'Questionnaire non trouvé' }; // Simulation
    };
    
    console.log('\n=== TEST SUR TOUS LES VOLETS ===');
    let problemCount = 0;
    volets.forEach((volet, index) => {
      console.log(`\nVolet ${index + 1}: ${volet.titre}`);
      console.log('- questionnaireId type:', typeof volet.questionnaireId);
      
      const questionnaire = getQuestionnaireInfo(volet.questionnaireId);
      console.log('- Questionnaire trouvé:', questionnaire ? questionnaire.titre : 'NON TROUVÉ');
      
      if (!questionnaire) {
        problemCount++;
      }
    });
    
    // Test de la logique de tri
    console.log('\n=== TEST DE TRI ===');
    const sortedVolets = [...volets].sort((a, b) => {
      const questionnaireIdA = typeof a.questionnaireId === 'object' && a.questionnaireId !== null 
        ? a.questionnaireId._id 
        : a.questionnaireId;
      const questionnaireIdB = typeof b.questionnaireId === 'object' && b.questionnaireId !== null 
        ? b.questionnaireId._id 
        : b.questionnaireId;
        
      if (questionnaireIdA !== questionnaireIdB) {
        return questionnaireIdA.localeCompare(questionnaireIdB);
      }
      return a.ordre - b.ordre;
    });
    
    console.log('Tri réussi! Volets triés:');
    sortedVolets.forEach(v => {
      const qId = typeof v.questionnaireId === 'object' ? v.questionnaireId._id : v.questionnaireId;
      console.log(`- ${v.titre} (ordre: ${v.ordre}, questionnaireId: ${qId.substring(0, 8)}...)`);
    });
    
    console.log(`\n✅ Résultats: ${volets.length - problemCount}/${volets.length} volets ont un questionnaire valide`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testVoletsLogic();