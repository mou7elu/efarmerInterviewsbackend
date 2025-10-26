const fetch = require('node-fetch');

async function testAPIStructure() {
  try {
    console.log('=== TEST DES QUESTIONS ===');
    const questionsResponse = await fetch('http://localhost:5001/api/questionnaire/questions');
    const questions = await questionsResponse.json();
    console.log('Nombre de questions:', questions.length);
    console.log('Structure de la première question:', JSON.stringify(questions[0], null, 2));
    
    console.log('\n=== TEST DES SECTIONS ===');
    const sectionsResponse = await fetch('http://localhost:5001/api/questionnaire/sections');
    const sections = await sectionsResponse.json();
    console.log('Nombre de sections:', sections.length);
    console.log('Structure de la première section:', JSON.stringify(sections[0], null, 2));
    
    console.log('\n=== VERIFICATION CORRESPONDANCE ===');
    if (questions.length > 0 && sections.length > 0) {
      const firstQuestion = questions[0];
      console.log('Question:', firstQuestion.code);
      console.log('sectionId dans question:', firstQuestion.sectionId);
      console.log('Type de sectionId:', typeof firstQuestion.sectionId);
      
      if (typeof firstQuestion.sectionId === 'object' && firstQuestion.sectionId !== null) {
        console.log('sectionId est un objet populé:', firstQuestion.sectionId);
      } else {
        console.log('sectionId est un ID simple, cherchons dans les sections...');
        const matchingSection = sections.find(s => s._id === firstQuestion.sectionId);
        console.log('Section correspondante trouvée:', matchingSection ? matchingSection.titre : 'NON TROUVÉE');
      }
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testAPIStructure();