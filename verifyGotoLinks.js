/**
 * Script de vérification complète de tous les sauts logiques
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function verifyAllGotoLinks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Récupérer toutes les questions avec leurs options
    const allQuestions = await Question.find().sort({ code: 1 });
    
    console.log('\n🔍 VÉRIFICATION COMPLÈTE DES SAUTS LOGIQUES:\n');
    
    let totalLinks = 0;
    let questionsWithLinks = 0;
    
    for (const question of allQuestions) {
      let hasLinks = false;
      let questionLinks = [];
      
      if (question.options && question.options.length > 0) {
        for (const option of question.options) {
          if (option.goto && option.goto.toString() !== '') {
            hasLinks = true;
            totalLinks++;
            
            // Trouver la question cible
            const targetQuestion = await Question.findById(option.goto);
            
            questionLinks.push({
              optionText: option.libelle,
              targetCode: targetQuestion ? targetQuestion.code : 'INTROUVABLE',
              targetText: targetQuestion ? targetQuestion.texte : 'QUESTION INTROUVABLE',
              targetId: option.goto
            });
          }
        }
      }
      
      if (hasLinks) {
        questionsWithLinks++;
        console.log(`📝 ${question.code}: "${question.texte.substring(0, 70)}..."`);
        
        for (const link of questionLinks) {
          console.log(`   ✅ "${link.optionText}" → ${link.targetCode}`);
          console.log(`      "${link.targetText.substring(0, 60)}..."`);
          console.log(`      ID: ${link.targetId}`);
        }
        console.log('');
      }
    }
    
    console.log(`📊 STATISTIQUES:`);
    console.log(`   - Questions avec des sauts: ${questionsWithLinks}`);
    console.log(`   - Total des liens de saut: ${totalLinks}`);
    console.log(`   - Total des questions: ${allQuestions.length}`);
    
    // Vérifier les questions spécifiques
    console.log('\n🎯 VÉRIFICATION DES QUESTIONS SPÉCIFIQUES:');
    
    const specificChecks = ['Q006', 'Q014', 'Q024', 'Q040', 'Q044', 'Q051', 'Q054'];
    
    for (const code of specificChecks) {
      const question = await Question.findOne({ code });
      if (question) {
        console.log(`\n${code}: "${question.texte.substring(0, 50)}..."`);
        if (question.options && question.options.length > 0) {
          for (const option of question.options) {
            if (option.goto) {
              const target = await Question.findById(option.goto);
              console.log(`   ✅ "${option.libelle}" → ${target ? target.code : 'ERREUR'}`);
            } else {
              console.log(`   ⭕ "${option.libelle}" (pas de saut)`);
            }
          }
        } else {
          console.log('   📝 Pas d\'options');
        }
      }
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

verifyAllGotoLinks();