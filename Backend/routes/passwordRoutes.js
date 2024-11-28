const express = require('express');
const { 
  createPasswordHandler, 
  getPasswordsHandler, 
  revealPasswordHandler, 
  authenticate, 
  updatePasswordHandler, 
  deletePasswordHandler 
} = require('../controllers/passwordController');

const router = express.Router();

router.post('/create', authenticate, createPasswordHandler);

router.get('/', authenticate, getPasswordsHandler);

router.post('/:passwordId/reveal', authenticate, revealPasswordHandler);

router.put('/:passwordId', authenticate, updatePasswordHandler);

router.delete('/:passwordId', authenticate, deletePasswordHandler);


module.exports = router;