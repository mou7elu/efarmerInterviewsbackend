/**
 * Analyse plus approfondie pour identifier la vraie structure des questions
 */

require('dotenv').config();
const mammoth = require('mammoth');
const path = require('path');

const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

async function analyzeStructure() {
  try {
    console.log('📥 Lecture du fichier Word...');
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    console.log('\n🔍 RECHERCHE DES VRAIES QUESTIONS:');
    console.log('Format potentiel: numéro au début de ligne suivi du texte\n');
    
    let questionCount = 0;
    for (let i = 0; i < lines.length && questionCount < 30; i++) {
      const line = lines[i];
      
      // Chercher des lignes qui commencent par un numéro suivi d'un point ou d'une parenthèse
      if (/^\d+[\.\)]\s+/.test(line)) {
        console.log(`Question ${questionCount + 1}: "${line}"`);
        questionCount++;
      }
    }
    
    console.log('\n\n🔍 RECHERCHE DE QUESTIONS AVEC MOTS-CLÉS:');
    console.log('Lignes contenant des mots-clés de questions\n');
    
    const questionKeywords = /^(Quel|Quelle|Combien|Avez|Êtes|Comment|Où|Quand|Pourquoi|Dans|Nom|Prénom|Âge|Date|Sexe|Numéro)/i;
    
    questionCount = 0;
    for (let i = 0; i < lines.length && questionCount < 30; i++) {
      const line = lines[i];
      
      if (questionKeywords.test(line) && line.length > 10) {
        console.log(`Question ${questionCount + 1}: "${line}"`);
        // Regarder les lignes suivantes pour les options
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j];
          if (/^\d+\.\s+/.test(nextLine) || /^-\s+/.test(nextLine)) {
            console.log(`   Option: "${nextLine}"`);
          } else if (nextLine.length > 0 && !/^(Si Q\.|Aller|Sinon)/i.test(nextLine)) {
            break;
          }
        }
        console.log('');
        questionCount++;
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

analyzeStructure();