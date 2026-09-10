function compareToTen(num) {
	return new Promise((resolve, reject) => {
		if (num <= 10) {
			resolve(`${num} is less than or equal to 10`);
		} else {
			reject(`${num} is greater than 10`);
		}
	});
}

const successPromise = new Promise((resolve) => {
	setTimeout(() => resolve("success"), 4000);
});

const resolvedPromise = Promise.resolve(3);
const rejectedPromise = Promise.reject("Boo!");

module.exports = {
	compareToTen,
	successPromise,
	resolvedPromise,
	rejectedPromise,
};
