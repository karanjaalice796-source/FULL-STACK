const axios = require('axios');

async function fetchAndDisplayPostTitles() {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = response.data;

    if (!Array.isArray(posts)) {
        throw new Error('The posts API returned an unexpected response.');
    }

    posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
    });

    return posts;
}

module.exports = fetchAndDisplayPostTitles;