const { addFakeUser, promptForUser, users } = require('./users');

async function main() {
    if (process.argv.includes('--prompt')) {
        await promptForUser();
    } else {
        for (let index = 0; index < 5; index += 1) {
            addFakeUser();
        }
    }

    console.log(JSON.stringify(users, null, 2));
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});