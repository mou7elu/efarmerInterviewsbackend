const express = require('express');
const VillageController = require('../controllers/villageController');

const router = express.Router();
const villageController = new VillageController();

// Routes pour les villages
router.get('/', (req, res) => villageController.getAll(req, res));
router.get('/:id', (req, res) => villageController.getById(req, res));
router.post('/', (req, res) => villageController.create(req, res));
router.put('/:id', (req, res) => villageController.update(req, res));
router.delete('/:id', (req, res) => villageController.delete(req, res));

module.exports = router;