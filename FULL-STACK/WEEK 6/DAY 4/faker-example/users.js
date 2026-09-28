const { faker } = require('@faker-js/faker');
const { createInterface } = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const users = [];

function addFakeUser() {
    const user = {
        name: faker.person.fullName(),
        street: faker.location.streetAddress(),
        country: faker.location.country()
    };
    users.push(user);
    return user;
}

function addUser(name, street, country) {
    const values = [name, street, country];
    if (values.some((value) => typeof value !== 'string' || !value.trim())) {
        throw new Error('Name, street, and country are all required.');
    }

    const user = {
        name: name.trim(),
        street: street.trim(),
        country: country.trim()
    };
    users.push(user);
    return user;
}

async function promptForUser() {
    const prompt = createInterface({ input: stdin, output: stdout });
    try {
        const name = await prompt.question('Name: ');
        const street = await prompt.question('Street address: ');
        const country = await prompt.question('Country: ');
        return addUser(name, street, country);
    } finally {
        prompt.close();
    }
}

module.exports = { users, addFakeUser, addUser, promptForUser };