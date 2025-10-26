/**
 * Script pour peupler les tables de référence avec des données de base
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { 
  District, 
  Region, 
  Departement, 
  Souspref, 
  Village, 
  Pays, 
  Nationalite, 
  NiveauScolaire, 
  Piece 
} = require('./models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efarmer_interviews';

async function seedReferenceTables() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️ Connecté à MongoDB');

    console.log('🌱 PEUPLEMENT DES TABLES DE RÉFÉRENCE:\n');

    // 1. Pays
    console.log('🌍 Peuplement table Pays...');
    const paysData = [
      { Lib_pays: 'Côte d\'Ivoire' },
      { Lib_pays: 'Ghana' },
      { Lib_pays: 'Burkina Faso' },
      { Lib_pays: 'Mali' },
      { Lib_pays: 'Guinée' },
      { Lib_pays: 'Liberia' },
      { Lib_pays: 'Togo' },
      { Lib_pays: 'Bénin' },
      { Lib_pays: 'Niger' },
      { Lib_pays: 'Sénégal' }
    ];

    for (const paysItem of paysData) {
      const existing = await Pays.findOne({ Lib_pays: paysItem.Lib_pays });
      if (!existing) {
        await Pays.create(paysItem);
        console.log(`   ✅ Ajouté: ${paysItem.Lib_pays}`);
      }
    }

    // 2. Nationalités
    console.log('\n🏴 Peuplement table Nationalité...');
    const nationaliteData = [
      { Lib_Nation: 'Ivoirienne' },
      { Lib_Nation: 'Ghanéenne' },
      { Lib_Nation: 'Burkinabé' },
      { Lib_Nation: 'Malienne' },
      { Lib_Nation: 'Guinéenne' },
      { Lib_Nation: 'Libérienne' },
      { Lib_Nation: 'Togolaise' },
      { Lib_Nation: 'Béninoise' },
      { Lib_Nation: 'Nigérienne' },
      { Lib_Nation: 'Sénégalaise' }
    ];

    for (const natItem of nationaliteData) {
      const existing = await Nationalite.findOne({ Lib_Nation: natItem.Lib_Nation });
      if (!existing) {
        await Nationalite.create(natItem);
        console.log(`   ✅ Ajouté: ${natItem.Lib_Nation}`);
      }
    }

    // 3. Niveaux Scolaires
    console.log('\n🎓 Peuplement table NiveauScolaire...');
    const niveauScolaireData = [
      { Lib_NiveauScolaire: 'Aucun niveau' },
      { Lib_NiveauScolaire: 'Primaire' },
      { Lib_NiveauScolaire: 'Secondaire 1er cycle' },
      { Lib_NiveauScolaire: 'Secondaire 2nd cycle' },
      { Lib_NiveauScolaire: 'Supérieur' },
      { Lib_NiveauScolaire: 'Formation professionnelle' },
      { Lib_NiveauScolaire: 'Formation agricole' },
      { Lib_NiveauScolaire: 'Alphabétisation' }
    ];

    for (const niveauItem of niveauScolaireData) {
      const existing = await NiveauScolaire.findOne({ Lib_NiveauScolaire: niveauItem.Lib_NiveauScolaire });
      if (!existing) {
        await NiveauScolaire.create(niveauItem);
        console.log(`   ✅ Ajouté: ${niveauItem.Lib_NiveauScolaire}`);
      }
    }

    // 4. Pièces d'identité
    console.log('\n🆔 Peuplement table Piece...');
    const pieceData = [
      { Nom_piece: 'Carte Nationale d\'Identité (CNI)' },
      { Nom_piece: 'Passeport' },
      { Nom_piece: 'Permis de conduire' },
      { Nom_piece: 'Carte d\'étudiant' },
      { Nom_piece: 'Extrait d\'acte de naissance' },
      { Nom_piece: 'Carte d\'électeur' },
      { Nom_piece: 'Carte de séjour' },
      { Nom_piece: 'Récépissé de demande CNI' },
      { Nom_piece: 'Attestation d\'identité' },
      { Nom_piece: 'Aucune pièce' }
    ];

    for (const pieceItem of pieceData) {
      const existing = await Piece.findOne({ Nom_piece: pieceItem.Nom_piece });
      if (!existing) {
        await Piece.create(pieceItem);
        console.log(`   ✅ Ajouté: ${pieceItem.Nom_piece}`);
      }
    }

    // 5. Villages échantillon (Côte d'Ivoire)
    console.log('\n🏘️ Peuplement table Village (échantillon)...');
    
    // D'abord récupérer la Côte d'Ivoire
    const coteDIvoire = await Pays.findOne({ Lib_pays: 'Côte d\'Ivoire' });
    if (!coteDIvoire) {
      console.log('   ❌ Côte d\'Ivoire non trouvée dans les pays');
      return;
    }
    
    const villageData = [
      { Lib_village: 'Abidjan', PaysId: coteDIvoire._id },
      { Lib_village: 'Bouaké', PaysId: coteDIvoire._id },
      { Lib_village: 'Daloa', PaysId: coteDIvoire._id },
      { Lib_village: 'Yamoussoukro', PaysId: coteDIvoire._id },
      { Lib_village: 'San-Pédro', PaysId: coteDIvoire._id },
      { Lib_village: 'Korhogo', PaysId: coteDIvoire._id },
      { Lib_village: 'Man', PaysId: coteDIvoire._id },
      { Lib_village: 'Divo', PaysId: coteDIvoire._id },
      { Lib_village: 'Gagnoa', PaysId: coteDIvoire._id },
      { Lib_village: 'Abengourou', PaysId: coteDIvoire._id }
    ];

    for (const villageItem of villageData) {
      const existing = await Village.findOne({ Lib_village: villageItem.Lib_village });
      if (!existing) {
        await Village.create(villageItem);
        console.log(`   ✅ Ajouté: ${villageItem.Lib_village}`);
      }
    }

    // Afficher les statistiques finales
    console.log('\n📊 STATISTIQUES DES TABLES DE RÉFÉRENCE:');
    console.log('─'.repeat(50));
    
    const stats = [
      { table: 'Pays', count: await Pays.countDocuments() },
      { table: 'Nationalite', count: await Nationalite.countDocuments() },
      { table: 'NiveauScolaire', count: await NiveauScolaire.countDocuments() },
      { table: 'Piece', count: await Piece.countDocuments() },
      { table: 'Village', count: await Village.countDocuments() },
      { table: 'District', count: await District.countDocuments() },
      { table: 'Region', count: await Region.countDocuments() },
      { table: 'Departement', count: await Departement.countDocuments() },
      { table: 'Souspref', count: await Souspref.countDocuments() }
    ];

    stats.forEach(stat => {
      const icon = stat.count > 0 ? '✅' : '⚪';
      console.log(`${icon} ${stat.table}: ${stat.count} entrées`);
    });

    console.log('\n🎉 Tables de référence peuplées avec succès !');
    console.log('\n💡 Note: Les tables District, Region, Departement et Souspref');
    console.log('    nécessitent des données spécifiques selon la structure administrative.');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.disconnect();
  }
}

seedReferenceTables();