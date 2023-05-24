const express = require('express');
const router = express.Router();

const QuestionController = require('../controllers/question.controller');
const AnswerController = require('../controllers/answer.controller');
const AuthGuard = require('../middlewares/guards/auth.guard');

router.get('/', QuestionController.listQuestions);
router.get('/myQuestions', [AuthGuard.mustBeAuthenticated], QuestionController.listMyQuestions)
router.delete('/myQuestions/:id', [AuthGuard.mustBeAuthenticated], QuestionController.deleteMyQuestion)
router.get('/hotQuestions', QuestionController.hotQuestions);
router.get('/theQuestion/:id', QuestionController.showQuestionById);
router.post('/api/create/question', [AuthGuard.mustBeAuthenticated], QuestionController.createQuestion);

router.delete(`/myQuestions/deleteAnswer/:id`, [AuthGuard.mustBeAuthenticated], AnswerController.deleteAnswer)
router.put(`/myQuestions/deleteAnswer/:id`, [AuthGuard.mustBeAuthenticated], AnswerController.selectAnswer)
router.put(`/myQuestions/vote/:id`, [AuthGuard.mustBeAuthenticated], AnswerController.vote)
router.post('/api/create/answer/:id', [AuthGuard.mustBeAuthenticated], AnswerController.createAnswer);
router.post('/api/create/answer/:id', AnswerController.listAnswers);
router.get('/theQuestion/:idQuestion/comments/:idAnswer', [AuthGuard.mustBeAuthenticated], AnswerController.listComments);

module.exports = router;