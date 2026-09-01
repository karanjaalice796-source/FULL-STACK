const sentence = "The movie is not that bad, I like it";

const wordNot = sentence.indexOf("not");
const wordBad = sentence.indexOf("bad");

let result;

if (wordNot !== -1 && wordBad !== -1 && wordBad > wordNot) {
  // Everything before "not" + "good" + everything after "bad"
  const before = sentence.slice(0, wordNot);
  const after = sentence.slice(wordBad + "bad".length);
  result = before + "good" + after;
} else {
  result = sentence;
}

console.log(result);