const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const UserController = require('../controllers/user.controller')
const AuthGuard = require('../middlewares/guards/auth.guard');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({storage: storage});

router.get('/myProfile', [AuthGuard.mustBeAuthenticated], UserController.listInformation)
router.get('/api/me', [AuthGuard.mustBeAuthenticated], UserController.getMe)
router.post('/myProfile', upload.single('image'), UserController.addImage);

module.exports = router