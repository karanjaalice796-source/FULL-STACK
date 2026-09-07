function displayWordsInFrame() {
    const userInput = prompt("Enter several words separated by commas:");
    
    if (!userInput) return;
    const words = userInput.split(',').map(word => word.trim());
    let maxLength = 0;
    for (const word of words) {
        if (word.length > maxLength) {
            maxLength = word.length;
        }
    }
    const border = '*'.repeat(maxLength + 4);
    console.log(border);
    for (const word of words) {
        const paddedWord = word.padEnd(maxLength, ' ');
        console.log(`* ${paddedWord} *`);
    }
    console.log(border);
}
displayWordsInFrame();