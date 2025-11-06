const express = require('express');
const router = express.Router();
const Pays = require('../models/Pays');
const District = require('../models/district');
const Region = require('../models/Region');
const Parcelle = require('../models/Parcelle');

// GET /api/sig - retourne la hiérarchie pays > district > region > parcelles avec coordonnées
router.get('/', async (req, res) => {
  try {
    const pays = await Pays.find({ Sommeil: false });
    const districts = await District.find({ Sommeil: false });
    const regions = await Region.find({ Sommeil: false });
    const parcelles = await Parcelle.find();

    // Construction de la hiérarchie
    const result = pays.map(p => ({
      id: p._id,
      name: p.Lib_pays,
      coordinates: p.Coordonnee,
      districts: districts.filter(d => String(d.PaysId) === String(p._id)).map(d => ({
        id: d._id,
        name: d.Lib_district,
        regions: regions.filter(r => String(r.DistrictId) === String(d._id)).map(r => ({
          id: r._id,
          name: r.Lib_region,
          coordinates: r.Coordonnee,
          parcelles: parcelles.filter(pa => pa.Coordonnee && pa.Coordonnee !== null && pa.Coordonnee !== '' && pa.Superficie > 0).map(pa => ({
            id: pa._id,
            name: pa.Code,
            coordinates: pa.Coordonnee,
            superficie: pa.Superficie
          }))
        }))
      }))
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('SIG API error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur SIG' });
  }
});

module.exports = router;
