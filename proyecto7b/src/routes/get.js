import {Router} from 'express'

const router = Router();

import * as authCtrl from '../controller/get.js'


router.get('/answers',authCtrl.answers)
// http://localhost:3000/api/get/answers
router.get('/questions',authCtrl.questions)
// http://localhost:3000/api/get/questions
router.get('/randomQuestionsWithAnswers',authCtrl.randomQuestionsWithAnswers)
// http://localhost:3000/api/get/randomQuestionsWithAnswers

export default router;