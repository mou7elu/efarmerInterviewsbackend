const fetch = require('node-fetch');

async function testEditSectionLogic() {
  try {
    console.log('=== TEST EDIT SECTION LOGIC ===');
    
    // Récupérer une section et des volets
    const [sectionResponse, voletsResponse] = await Promise.all([
      fetch('http://localhost:5001/api/questionnaire/sections/68f50c23fd9b13ce3a4d9131'),
      fetch('http://localhost:5001/api/questionnaire/volets')
    ]);
    
    const sectionData = await sectionResponse.json();
    const voletsData = await voletsResponse.json();
    
    console.log('Section récupérée:', sectionData.titre);
    console.log('sectionData.voletId type:', typeof sectionData.voletId);
    console.log('sectionData.voletId:', sectionData.voletId);
    
    // Simuler la logique de formData
    const formData = {
      titre: sectionData.titre,
      ordre: sectionData.ordre,
      voletId: typeof sectionData.voletId === 'object' && sectionData.voletId !== null 
        ? sectionData.voletId._id 
        : sectionData.voletId
    };
    
    console.log('\nformData.voletId après correction:', formData.voletId);
    
    // Vérifier si la valeur existe dans les options du Select
    const voletExists = voletsData.find(v => v._id === formData.voletId);
    console.log('Volet trouvé dans les options:', voletExists ? voletExists.titre : 'NON TROUVÉ');
    
    // Simuler la logique de sécurité du Select
    const selectValue = voletsData.find(v => v._id === formData.voletId) ? formData.voletId : '';
    console.log('Valeur finale du Select:', selectValue);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testEditSectionLogic();