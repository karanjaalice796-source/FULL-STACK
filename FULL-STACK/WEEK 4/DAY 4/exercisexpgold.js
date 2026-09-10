const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve) => {
	setTimeout(resolve, 3000, "foo");
});

// Promise.all waits for every input to resolve and returns their values in the
// same order. Non-promises are treated as already-resolved values, so this is
// resolved with [3, 42, "foo"]. If any input rejects, Promise.all rejects.
const allPromisesResult = Promise.all([promise1, promise2, promise3])
	.then((result) => {
		console.log(result);
		return result;
	})
	.catch((error) => {
		console.log(error);
		throw error;
	});

function timesTwoAsync(x) {
	return new Promise((resolve) => resolve(x * 2));
}

const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);

const timesTwoResult = Promise.all(promiseArr).then((result) => {
	console.log(result);
	return result;
});

module.exports = {
	allPromisesResult,
	timesTwoAsync,
	promiseArr,
	timesTwoResult,
};
