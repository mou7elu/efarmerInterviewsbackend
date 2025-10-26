const fetch = require('node-fetch');

async function testSectionsAPI() {
  try {
    console.log('=== TEST SECTIONS API ===');
    
    const response = await fetch('http://localhost:5001/api/questionnaire/sections');
    const sections = await response.json();
    
    console.log('Nombre de sections:', sections.length);
    if (sections.length > 0) {
      const firstSection = sections[0];
      console.log('\nPremière section:');
      console.log('- ID:', firstSection._id);
      console.log('- Titre:', firstSection.titre);
      console.log('- Ordre:', firstSection.ordre);
      console.log('- voletId type:', typeof firstSection.voletId);
      console.log('- voletId données:', firstSection.voletId);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testSectionsAPI();