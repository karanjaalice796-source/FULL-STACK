const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const notes = require('./notes');

function reportError(error) {
  console.error(`Unable to access notes: ${error.message}`);
  process.exitCode = 1;
}

yargs(hideBin(process.argv))
  .scriptName('node app.js')
  .command('add', 'Add a note', (command) => command
    .option('title', { type: 'string', demandOption: true, describe: 'Note title' })
    .option('body', { type: 'string', demandOption: true, describe: 'Note body' }), (argv) => {
      if (!argv.title.trim() || !argv.body.trim()) {
        console.error('Title and body are required');
        process.exitCode = 1;
        return;
      }
      try {
        const result = notes.addNote(argv.title, argv.body);
        console.log(result.added ? `Note added: ${result.note.title}` : 'Note already exists');
      } catch (error) {
        reportError(error);
      }
    })
  .command('list', 'List all notes', () => {}, () => {
    try {
      const savedNotes = notes.listNotes();
      if (savedNotes.length === 0) {
        console.log('No notes found');
        return;
      }
      console.log('Your notes:');
      savedNotes.forEach((note) => console.log(`- ${note.title}`));
    } catch (error) {
      reportError(error);
    }
  })
  .command('read', 'Read a note', (command) => command
    .option('title', { type: 'string', demandOption: true, describe: 'Note title' }), (argv) => {
      try {
        const note = notes.readNote(argv.title);
        if (!note) {
          console.log('Note not found');
          return;
        }
        console.log(`Title: ${note.title}\nBody: ${note.body}`);
      } catch (error) {
        reportError(error);
      }
    })
  .command('remove', 'Remove a note', (command) => command
    .option('title', { type: 'string', demandOption: true, describe: 'Note title' }), (argv) => {
      try {
        const removed = notes.removeNote(argv.title);
        console.log(removed ? `Note removed: ${argv.title}` : 'Note not found');
      } catch (error) {
        reportError(error);
      }
    })
  .demandCommand(1, 'command not recognized')
  .strict()
  .help()
  .fail((message, error) => {
    console.error(message ? 'command not recognized' : error.message);
    process.exitCode = 1;
  })
  .parse();
