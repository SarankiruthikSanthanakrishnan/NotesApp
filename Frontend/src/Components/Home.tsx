import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Note {
  note_id: number;
  note: string;
  user_id: number;
  date: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get<Note[]>(
        'http://localhost:5000/api/notes/',
        { withCredentials: true }
      );
      setNotes(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || error.message);
        navigate('/login');
      }
    }
  }, [navigate]);

  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        withCredentials: true,
      });
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const saveNoteorEditNote = async () => {
    if (!noteText.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editId}`,
          { note: noteText },
          { withCredentials: true }
        );
        toast.success('Note updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/notes/create',
          { note: noteText },
          { withCredentials: true }
        );
        toast.success('Note saved successfully');
      }

      setNoteText('');
      setEditId(null);
      fetchNotes();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Action failed');
      }
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      await fetchNotes();
    };
    loadNotes();
  }, [fetchNotes]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-200 py-12 px-4">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10">
        Welcome to the Notes App
      </h1>

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <textarea
          rows={6}
          placeholder="Write your notes here..."
          className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        <button
          onClick={saveNoteorEditNote}
          className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-lg font-semibold text-white hover:bg-purple-700 transition"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              saveNoteorEditNote();
            }
          }}
        >
          {editId ? 'Update Note' : 'Save Note'}
        </button>

        <div className="mt-6 space-y-4">
          {notes.length === 0 ? (
            <p className="text-center text-gray-500">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.note_id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <p className="text-gray-800 whitespace-pre-wrap">{note.note}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Created on:{' '}
                  {new Date(note.date).toLocaleString().split(',')[0]}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 transition"
                    onClick={() => {
                      setEditId(note.note_id);
                      setNoteText(note.note);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                    onClick={() => deleteNote(note.note_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
