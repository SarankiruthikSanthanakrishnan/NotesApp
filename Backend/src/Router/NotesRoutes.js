const express = require('express');
const {
  createNote,
  getNotes,
  updateNotes,
  deleteNotes,
} = require('../Controller/NotesController');
const auth = require('../Middleware/auth');

const router = express.Router();

router.post('/create', auth, createNote);
router.get('/', auth, getNotes);
router.put('/:id', auth, updateNotes);
router.delete('/:id', auth, deleteNotes);
module.exports = router;
