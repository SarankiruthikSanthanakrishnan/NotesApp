const db = require('../config/db');

const createNote = async (req, res) => {
  try {
    const { note } = req.body;
    const user_id = req.user.id;
    const date = new Date().toISOString().split('T')[0];
    const [result] = await db.execute(
      'INSERT INTO notes (user_id,note,date) VALUES(?,?,?)',
      [user_id, note, date]
    );
    res
      .status(201)
      .json({ message: 'Note Created Successfully', noteId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [notes] = await db.execute('SELECT * FROM notes WHERE user_id=?', [
      user_id,
    ]);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateNotes = async (req, res) => {
  try {
    const { note } = req.body;
    const noteId = req.params.id;
    const user_id = req.user.id;
    const [result] = await db.execute(
      'UPDATE notes SET note=? WHERE user_id=? and note_id=?',
      [note, user_id, noteId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note Not Found' });
    }
    res.status(200).json({ message: 'Note Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteNotes = async (req, res) => {
  try {
    const noteId = req.params.id;
    const user_id = req.user.id;
    const [result] = await db.execute(
      'DELETE FROM notes  WHERE user_id=? and note_id=?',
      [user_id, noteId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note Not Found' });
    }
    res.status(200).json({ message: 'Note Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
module.exports = { createNote, getNotes, updateNotes, deleteNotes };
