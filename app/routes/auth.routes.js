const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const AuthGuard = require('../middlewares/guards/auth.guard');

router.get('/register', [AuthGuard.mustNotBeAuthenticated], AuthController.register);
router.post('/register', [AuthGuard.mustNotBeAuthenticated], AuthController.registerPost);

router.get('/login', [AuthGuard.mustNotBeAuthenticated], AuthController.login);
router.post('/login', [AuthGuard.mustNotBeAuthenticated], AuthController.loginPost);


module.exports = router;