const express = require('express');
const router = express.Router();

const LabelController = require('../controllers/label.controller');
const AuthGuard = require('../middlewares/guards/auth.guard');

router.post('/api/create/label', [AuthGuard.mustBeAuthenticated], LabelController.createLabel);
router.get('/api/labels', [AuthGuard.mustBeAuthenticated], LabelController.getLabels);

module.exports = router;