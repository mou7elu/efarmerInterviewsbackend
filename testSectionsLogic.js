const fetch = require('node-fetch');

async function testSectionsLogic() {
  try {
    console.log('=== TEST LOGIC SECTIONS PAGE ===');
    
    const sectionsResponse = await fetch('http://localhost:5001/api/questionnaire/sections');
    const sections = await sectionsResponse.json();
    
    const voletsResponse = await fetch('http://localhost:5001/api/questionnaire/volets');  
    const volets = await voletsResponse.json();
    
    console.log('Sections récupérées:', sections.length);
    console.log('Volets récupérés:', volets.length);
    
    // Simuler la logique de getVoletInfo
    const getVoletInfo = (voletId) => {
      // Si voletId est déjà un objet populé par le backend
      if (typeof voletId === 'object' && voletId !== null && voletId._id) {
        return voletId;
      }
      // Sinon, chercher dans la liste des volets
      return volets.find(v => v._id === voletId);
    };
    
    console.log('\n=== TEST SUR PREMIÈRE SECTION ===');
    const firstSection = sections[0];
    console.log('Section:', firstSection.titre);
    console.log('voletId type:', typeof firstSection.voletId);
    
    const voletInfo = getVoletInfo(firstSection.voletId);
    console.log('Volet trouvé:', voletInfo ? voletInfo.titre : 'NON TROUVÉ');
    
    // Test sur toutes les sections
    console.log('\n=== TEST SUR TOUTES LES SECTIONS ===');
    let problemCount = 0;
    sections.forEach(section => {
      const volet = getVoletInfo(section.voletId);
      if (!volet) {
        console.log('❌ Problème avec section:', section.titre);
        problemCount++;
      }
    });
    
    console.log(`✅ Résultats: ${sections.length - problemCount}/${sections.length} sections ont un volet valide`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testSectionsLogic();