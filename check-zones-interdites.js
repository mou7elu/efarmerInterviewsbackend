const mongoose = require('mongoose');
require('./config/database.js');

const Zone_interdit = require('./models/Zone_interdit');

async function checkZonesInterdites() {
  try {
    // Attendre la connexion
    await new Promise(resolve => {
      mongoose.connection.once('open', resolve);
    });
    
    console.log('Connexion MongoDB établie');
    
    // Vérifier toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections disponibles:');
    collections.forEach(c => console.log(' -', c.name));
    
    // Vérifier les zones interdites
    console.log('\n--- Vérification Zone_interdit ---');
    const zones = await Zone_interdit.find();
    console.log(`Nombre de zones interdites: ${zones.length}`);
    
    if (zones.length > 0) {
      console.log('\nPremière zone:');
      console.log(JSON.stringify(zones[0], null, 2));
    }
    
    // Vérifier aussi par nom de collection alternatif
    console.log('\n--- Vérification alternative ---');
    const rawZones = await mongoose.connection.db.collection('zone_interdits').find().toArray();
    console.log(`Zones trouvées (zone_interdits): ${rawZones.length}`);
    
    const rawZones2 = await mongoose.connection.db.collection('zonesinterdites').find().toArray();
    console.log(`Zones trouvées (zonesinterdites): ${rawZones2.length}`);
    
    const rawZones3 = await mongoose.connection.db.collection('Zone_interdits').find().toArray();
    console.log(`Zones trouvées (Zone_interdits): ${rawZones3.length}`);
    
    if (rawZones.length > 0) {
      console.log('\nPremière zone (raw):');
      console.log(JSON.stringify(rawZones[0], null, 2));
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Démarrer la vérification après un délai
setTimeout(checkZonesInterdites, 2000);