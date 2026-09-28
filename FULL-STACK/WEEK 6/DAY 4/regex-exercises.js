const { createInterface } = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

function returnNumbers(value) {
    return String(value).match(/\d/g)?.join('') ?? '';
}

function isValidFullName(value) {
    return /^\p{Lu}\p{L}* \p{Lu}\p{L}*$/u.test(value);
}

async function promptForFullName() {
    const prompt = createInterface({ input: stdin, output: stdout });
    try {
        const fullName = await prompt.question('Enter your full name (First Last): ');
        if (isValidFullName(fullName)) {
            console.log('Valid name.');
            return true;
        }

        console.log('Invalid name. Use two names with one space and capitalize each first letter.');
        return false;
    } finally {
        prompt.close();
    }
}

module.exports = { returnNumbers, isValidFullName, promptForFullName };

if (require.main === module) {
    console.log(`Extracted numbers: ${returnNumbers('k5k3q2g5z6x9bn')}`);
    promptForFullName();
}