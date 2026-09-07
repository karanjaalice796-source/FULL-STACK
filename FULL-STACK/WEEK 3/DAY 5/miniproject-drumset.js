// Function to play sound based on key identifier
function playSound(keyLetter) {
  if (!keyLetter) return;

  const keyLower = keyLetter.toLowerCase();
  const audio = document.querySelector(`audio[data-key="${keyLower}"]`);
  const keyElement = document.querySelector(`.key[data-key="${keyLower}"]`);

  if (!audio) return; // Exit if no matching audio element exists

  audio.currentTime = 0; // Rewind audio to start for rapid key presses
  audio.play();

  if (keyElement) {
    keyElement.classList.add('playing');
  }
}

// Keyboard Event Listener
window.addEventListener('keydown', (event) => {
  // Support modern event.key with fallback for event.keyCode
  const key = event.key ? event.key : String.fromCharCode(event.keyCode);
  playSound(key);
});

// Mouse Click Listeners
const keys = document.querySelectorAll('.key');

keys.forEach((keyElement) => {
  // Play sound on click
  keyElement.addEventListener('click', function () {
    const keyAttr = this.getAttribute('data-key');
    playSound(keyAttr);
  });

  // Remove active highlight class when transition finishes
  keyElement.addEventListener('transitionend', function (event) {
    if (event.propertyName !== 'transform') return;
    this.classList.remove('playing');
  });
});