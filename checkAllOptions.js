/**
 * Script pour compter et lister toutes les questions avec options
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Question } = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function checkAllOptions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    // Compter toutes les questions
    const totalQuestions = await Question.countDocuments();
    console.log(`📊 Total questions: ${totalQuestions}`);

    // Compter les questions avec options
    const questionsWithOptions = await Question.countDocuments({
      $expr: { $gt: [{ $size: "$options" }, 0] }
    });
    console.log(`📊 Questions avec options: ${questionsWithOptions}`);

    // Compter les questions sans options
    const questionsWithoutOptions = await Question.countDocuments({
      $expr: { $eq: [{ $size: "$options" }, 0] }
    });
    console.log(`📊 Questions sans options: ${questionsWithoutOptions}`);

    // Lister par type
    console.log('\n📈 RÉPARTITION PAR TYPE:');
    const types = await Question.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          withOptions: {
            $sum: {
              $cond: [{ $gt: [{ $size: "$options" }, 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    for (const type of types) {
      console.log(`   ${type._id}: ${type.count} questions (${type.withOptions} avec options)`);
    }

    // Exemples de questions par type avec leurs options
    console.log('\n📝 EXEMPLES PAR TYPE:');
    
    for (const typeInfo of types) {
      const example = await Question.findOne({ type: typeInfo._id });
      console.log(`\n${typeInfo._id.toUpperCase()}:`);
      console.log(`   Exemple: ${example.code} - ${example.texte.substring(0, 60)}...`);
      console.log(`   Options: ${example.options.length}`);
      if (example.options.length > 0) {
        example.options.slice(0, 2).forEach(opt => {
          console.log(`      - ${opt.libelle} (${opt.valeur})`);
        });
      }
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

checkAllOptions();