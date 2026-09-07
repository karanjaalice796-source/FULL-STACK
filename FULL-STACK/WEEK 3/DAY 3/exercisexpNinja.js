//ex1. calculate the tip
function calculateTip() {
    const billAmount = document.getElementById('billAmt').value;
    const serviceQuality = document.getElementById('serviceQual').value;
    let numberOfPeople = document.getElementById('numOfPeople').value;
    const eachTag = document.getElementById('each');
    const totalTipTag = document.getElementById('totalTip');
    const tipTag = document.getElementById('tip');

    // Condition 1: Check if input fields are empty or service quality is not selected
    if (serviceQuality === "0" || billAmount === "") {
        alert("Please enter both the bill amount and service quality.");
        return;
    }

    // Condition 2: Validate number of people
    if (numberOfPeople === "" || parseInt(numberOfPeople) < 1) {
        numberOfPeople = 1;
        eachTag.style.display = "none";
    } else {
        eachTag.style.display = "inline";
    }

    // Calculate total tip per person
    let total = (parseFloat(billAmount) * parseFloat(serviceQuality)) / parseInt(numberOfPeople);
    total = total.toFixed(2);

    // Display result
    totalTipTag.style.display = "block";
    tipTag.textContent = total;
}

// Bind click event to the calculate button
document.getElementById('calculate').onclick = calculateTip;

//ex2. validate the email.
const emailForm = document.getElementById('emailForm');
const userEmailInput = document.getElementById('userEmail');

// Approach 1: Without Regex (Using string methods)
function validateEmailWithoutRegex(email) {
    const atIndex = email.indexOf('@');
    const lastAtIndex = email.lastIndexOf('@');
    const dotIndex = email.lastIndexOf('.');

    // Rules:
    // 1. '@' exists and isn't the first character
    // 2. Only one '@' present
    // 3. '.' exists after '@' with characters between them
    // 4. At least 2 characters after the last '.'
    if (
        atIndex > 0 &&
        atIndex === lastAtIndex &&
        dotIndex > atIndex + 1 &&
        dotIndex < email.length - 2
    ) {
        return true;
    }
    return false;
}

// Approach 2: With Regex
function validateEmailWithRegex(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Form Submit Handler
emailForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop form submission
    const emailValue = userEmailInput.value.trim();

    const isValidWithoutRegex = validateEmailWithoutRegex(emailValue);
    const isValidWithRegex = validateEmailWithRegex(emailValue);

    if (isValidWithoutRegex && isValidWithRegex) {
        alert("Success: Email address is valid!");
    } else {
        alert("Error: Please enter a valid email address.");
    }
});

//ex3. get user geolocation coordinate.
const getLocationBtn = document.getElementById('getLocationBtn');
const output = document.getElementById('output');

function getLocation() {
    if ("geolocation" in navigator) {
        output.textContent = "Locating...";
        
        navigator.geolocation.getCurrentPosition(
            // Success Callback
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                output.textContent = `Latitude: ${latitude} Longitude: ${longitude}`;
            },
            // Error Callback
            function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        output.textContent = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        output.textContent = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        output.textContent = "The request to get user location timed out.";
                        break;
                    default:
                        output.textContent = "An unknown error occurred.";
                        break;
                }
            }
        );
    } else {
        output.textContent = "Geolocation is not supported by this browser.";
    }
}

getLocationBtn.addEventListener('click', getLocation);