const { addDays, format } = require('date-fns');

function displayDateFiveDaysFromNow() {
    const now = new Date();
    const futureDate = addDays(now, 5);
    const formattedDate = format(futureDate, 'MMMM do, yyyy h:mm a');

    console.log(`Current date: ${format(now, 'MMMM do, yyyy h:mm a')}`);
    console.log(`In five days: ${formattedDate}`);
    return { now, futureDate, formattedDate };
}

module.exports = displayDateFiveDaysFromNow;