const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const notesFile = path.join(__dirname, 'data', 'notes.json');

function readNotes() {
  const notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
  if (!Array.isArray(notes)) {
    throw new Error('Notes data must be a JSON array');
  }
  return notes;
}

function writeNotes(notes) {
  fs.writeFileSync(notesFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8');
}

function findNoteIndex(notes, title) {
  return _.findIndex(notes, (note) => note.title.toLowerCase() === title.trim().toLowerCase());
}

function addNote(title, body) {
  const savedNotes = readNotes();
  if (findNoteIndex(savedNotes, title) !== -1) {
    return { added: false, note: null };
  }

  const note = { title: title.trim(), body };
  savedNotes.push(note);
  writeNotes(savedNotes);
  return { added: true, note };
}

function listNotes() {
  return readNotes();
}

function readNote(title) {
  const savedNotes = readNotes();
  const index = findNoteIndex(savedNotes, title);
  return index === -1 ? null : savedNotes[index];
}

function removeNote(title) {
  const savedNotes = readNotes();
  const index = findNoteIndex(savedNotes, title);
  if (index === -1) return false;
  savedNotes.splice(index, 1);
  writeNotes(savedNotes);
  return true;
}

module.exports = { addNote, listNotes, readNote, removeNote };
