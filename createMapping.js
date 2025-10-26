/**
 * Script pour créer un mapping manuel entre les références Word et notre système
 */

require('dotenv').config();
const mongoose = require('mongoose');
const mammoth = require('mammoth');
const path = require('path');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';
const DOCX_FILE = path.join(__dirname, 'Questionnaire_IEEA.docx');

async function createMapping() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Récupérer toutes nos questions dans l'ordre
    const questions = await Question.find({}).sort({ code: 1 });
    
    // Lire le fichier Word
    const { value: text } = await mammoth.extractRawText({ path: DOCX_FILE });
    
    console.log('\n🔍 MAPPING DES RÉFÉRENCES:');
    console.log('Recherche des questions qui pourraient correspondre aux références du Word...\n');
    
    // Mapping manuel basé sur l'analyse du contenu
    const mappingHints = {
      16: "Êtes-vous l'exploitant", // Q.16 = "Oui" aller à Q.34
      21: "pays d'origine",
      22: "Côte d'ivoire",
      34: "formation",
      37: "pays",
      38: "après formation",
      47: "nationalité",
      48: "document",
      49: "identité",
      53: "personnes vivent",
      55: "enfants"
    };
    
    const mapping = new Map();
    
    for (const [wordNum, hint] of Object.entries(mappingHints)) {
      console.log(`🔍 Recherche de Q.${wordNum} (indices: "${hint}"):`);
      
      const matchingQuestions = questions.filter(q => 
        q.texte.toLowerCase().includes(hint.toLowerCase()) ||
        q.texte.toLowerCase().includes(hint.toLowerCase().split(' ')[0])
      );
      
      if (matchingQuestions.length > 0) {
        console.log(`   Candidats trouvés:`);
        matchingQuestions.forEach(q => {
          console.log(`      ${q.code}: ${q.texte.substring(0, 80)}...`);
        });
        
        // Prendre le premier match le plus pertinent
        const bestMatch = matchingQuestions[0];
        mapping.set(`Q.${wordNum}`, bestMatch.code);
        console.log(`   ✅ Mapping: Q.${wordNum} → ${bestMatch.code}`);
      } else {
        console.log(`   ❌ Aucune correspondance trouvée`);
      }
      console.log('');
    }
    
    console.log('\n📊 MAPPING FINAL:');
    mapping.forEach((systemCode, wordRef) => {
      console.log(`   ${wordRef} → ${systemCode}`);
    });
    
    // Maintenant chercher les sauts logiques et les appliquer
    console.log('\n🔗 APPLICATION DES SAUTS LOGIQUES:');
    const gotoPattern = /Si\s+Q\.(\d+)\s*=\s*["""]?([^"""]+?)["""]?,?\s*aller\s+à\s+Q\.(\d+)/gi;
    
    let match;
    let jumpsApplied = 0;
    
    while ((match = gotoPattern.exec(text)) !== null) {
      const sourceWordRef = `Q.${match[1]}`;
      const condition = match[2].trim();
      const targetWordRef = `Q.${match[3]}`;
      
      const sourceSystemCode = mapping.get(sourceWordRef);
      const targetSystemCode = mapping.get(targetWordRef);
      
      if (sourceSystemCode && targetSystemCode) {
        console.log(`✅ ${sourceWordRef} (${sourceSystemCode}) = "${condition}" → ${targetWordRef} (${targetSystemCode})`);
        
        // Appliquer le saut à la question
        const sourceQuestion = await Question.findOne({ code: sourceSystemCode });
        if (sourceQuestion) {
          // Trouver l'option correspondante
          const matchingOption = sourceQuestion.options.find(opt => 
            opt.libelle.toLowerCase().includes(condition.toLowerCase()) ||
            opt.valeur.toLowerCase().includes(condition.toLowerCase().replace(/\s+/g, '_'))
          );
          
          if (matchingOption) {
            matchingOption.goto = targetSystemCode;
            await sourceQuestion.save();
            jumpsApplied++;
            console.log(`   ✅ Saut appliqué: ${sourceSystemCode}.options[${matchingOption.libelle}] → ${targetSystemCode}`);
          } else {
            console.log(`   ❌ Option "${condition}" non trouvée dans ${sourceSystemCode}`);
          }
        }
      } else {
        console.log(`❌ ${sourceWordRef} = "${condition}" → ${targetWordRef} (mapping manquant)`);
      }
    }
    
    console.log(`\n🎉 ${jumpsApplied} sauts logiques appliqués avec succès !`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

createMapping();