const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview
} = require('../controllers/interviewController');

const router = express.Router();

router.use(protect); // Toutes les routes nécessitent une authentification

router.route('/')
  .get(getInterviews)
  .post(createInterview);

router.route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

// Route PDF : /api/interviews/:id/pdf
const path = require('path');
const fs = require('fs');
const { fillDocxTemplate } = require('../utils/docxTemplate');
const { convertDocxToPdf } = require('../utils/docxToPdf');
const Interview = require('../models/Interview');

router.get('/:id/pdf', async (req, res) => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findById(interviewId).lean();
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Remplir le template DOCX
    const templatePath = path.join(__dirname, '../../Questionnaire_IEEA.docx');
    const filledDocxPath = path.join(__dirname, `../../tmp/interview_${interviewId}.docx`);
    await fillDocxTemplate(templatePath, filledDocxPath, interview);

    // Convertir en PDF
    const pdfPath = path.join(__dirname, `../../tmp/interview_${interviewId}.pdf`);
    await convertDocxToPdf(filledDocxPath, pdfPath);

    // Envoyer le PDF
    res.download(pdfPath, `entretien_${interviewId}.pdf`, (err) => {
      // Nettoyage des fichiers temporaires
      fs.unlink(filledDocxPath, () => {});
      fs.unlink(pdfPath, () => {});
    });
  } catch (err) {
    console.error('Erreur génération PDF:', err);
    res.status(500).json({ error: 'Erreur génération PDF' });
  }
});

module.exports = router;