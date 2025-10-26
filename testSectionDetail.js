const fetch = require('node-fetch');

async function testSectionDetail() {
  try {
    console.log('=== TEST SECTION DETAIL ===');
    
    // Récupérer une section spécifique
    const response = await fetch('http://localhost:5001/api/questionnaire/sections/68f50c23fd9b13ce3a4d9131');
    const section = await response.json();
    
    console.log('Section récupérée:');
    console.log('- ID:', section._id);
    console.log('- Titre:', section.titre);
    console.log('- Ordre:', section.ordre);
    console.log('\n- Volet:');
    console.log('  - Type:', typeof section.voletId);
    console.log('  - Données:', section.voletId);
    
    // Test de la logique frontend
    const getVoletTitle = (voletData) => {
      if (typeof voletData === 'object' && voletData !== null && voletData.titre) {
        return voletData.titre;
      }
      return '— non renseigné —';
    };
    
    console.log('\n- Résultat getVoletTitle:', getVoletTitle(section.voletId));
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testSectionDetail();