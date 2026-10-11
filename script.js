const themeButton = document.querySelector("#themeButton");
const eventCards = document.querySelectorAll(".event-card");

const form = document.querySelector("#registrationForm");
const nameInput = document.querySelector("#fullName");
const emailInput = document.querySelector("#email");
const groupInput = document.querySelector("#studentGroup");
const selectedEventInput = document.querySelector("#selectedEvent");
const agreementInput = document.querySelector("#agreement");

const selectedEventText = document.querySelector("#selectedEventText");
const eventError = document.querySelector("#eventError");
const nameCounter = document.querySelector("#nameCounter");
const formMessage = document.querySelector("#formMessage");

const registrationList = document.querySelector("#registrationList");
const registrationCount = document.querySelector("#registrationCount");
const emptyMessage = document.querySelector("#emptyMessage");

let selectedEvent = "";

const registrations = [];

const events = [
    "Web Design Workshop",
    "JavaScript Quiz",
    "IT Career Talk"
];

// Select an event.
eventCards.forEach(function (card) {
    const button = card.querySelector(".select-button");

    button.addEventListener("click", function () {
        eventCards.forEach(function (otherCard) {
            otherCard.classList.remove("selected-event");

            otherCard.querySelector(".select-button").textContent =
                "Select event →";
        });

        card.classList.add("selected-event");
        button.textContent = "Selected ✓";

        selectedEvent = card.dataset.event;
        selectedEventInput.value = selectedEvent;

        selectedEventText.textContent =
            "Selected event: " + selectedEvent;

        eventError.textContent = "";
        formMessage.textContent = "";
    });
});

// Switch between light and dark themes.
themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeButton.textContent = "Light theme";
    } else {
        themeButton.textContent = "Dark theme";
    }
});

// Count the characters in the name field.
nameInput.addEventListener("input", function () {
    nameCounter.textContent =
        nameInput.value.length + " characters";

    if (nameInput.value.trim().length >= 3) {
        clearError(nameInput, "nameError");
    }
});

// Show an error message for an invalid field.
function showError(input, errorId, message) {
    input.classList.add("invalid");
    document.querySelector("#" + errorId).textContent = message;
}

// Remove the error message.
function clearError(input, errorId) {
    input.classList.remove("invalid");
    document.querySelector("#" + errorId).textContent = "";
}

// Validate the full name.
function validateName() {
    if (nameInput.value.trim().length < 3) {
        showError(
            nameInput,
            "nameError",
            "Enter at least 3 characters."
        );
        return false;
    }

    clearError(nameInput, "nameError");
    return true;
}

// Validate the email address.
function validateEmail() {
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError(
            emailInput,
            "emailError",
            "Enter a valid email address."
        );
        return false;
    }

    clearError(emailInput, "emailError");
    return true;
}

// Validate the student group.
function validateGroup() {
    if (groupInput.value.trim() === "") {
        showError(
            groupInput,
            "groupError",
            "Enter your student group."
        );
        return false;
    }

    clearError(groupInput, "groupError");
    return true;
}

// Validate the selected event.
function validateEvent() {
    if (!events.includes(selectedEvent)) {
        eventError.textContent = "Please select an event.";
        return false;
    }

    eventError.textContent = "";
    return true;
}

// Validate the agreement checkbox.
function validateAgreement() {
    const agreementError = document.querySelector("#agreementError");

    if (!agreementInput.checked) {
        agreementError.textContent =
            "You must agree to the registration rules.";
        return false;
    }

    agreementError.textContent = "";
    return true;
}

// Check fields when the user changes their values.
emailInput.addEventListener("input", function () {
    if (emailInput.value !== "") {
        validateEmail();
    }
});

groupInput.addEventListener("input", function () {
    if (groupInput.value !== "") {
        validateGroup();
    }
});

agreementInput.addEventListener("change", function () {
    validateAgreement();
});

// Submit the registration form.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const groupIsValid = validateGroup();
    const eventIsValid = validateEvent();
    const agreementIsValid = validateAgreement();

    if (
        !nameIsValid ||
        !emailIsValid ||
        !groupIsValid ||
        !eventIsValid ||
        !agreementIsValid
    ) {
        formMessage.textContent =
            "Please correct the errors above.";

        formMessage.className = "";
        return;
    }

    const registration = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        group: groupInput.value.trim(),
        event: selectedEvent
    };

    registrations.push(registration);

    addRegistration(registration);

    formMessage.textContent =
        "Registration successful! Thank you, " +
        registration.name + "!";

    formMessage.className = "success-message";

    form.reset();

    selectedEvent = "";
    selectedEventInput.value = "";

    eventCards.forEach(function (card) {
        card.classList.remove("selected-event");
        card.querySelector(".select-button").textContent =
            "Select event →";
    });

    selectedEventText.textContent = "No event selected.";
    nameCounter.textContent = "0 characters";

    updateRegistrationCount();
});

// Add a registration to the page.
function addRegistration(registration) {
    const item = document.createElement("li");
    item.classList.add("registration-item");

    const avatar = document.createElement("div");
    avatar.classList.add("registration-avatar");
    avatar.textContent = registration.name.charAt(0).toUpperCase();

    const info = document.createElement("div");
    info.classList.add("registration-info");

    const name = document.createElement("strong");
    name.textContent = registration.name;

    const details = document.createElement("span");
    details.textContent =
        registration.email + " · " + registration.group;

    info.appendChild(name);
    info.appendChild(details);

    const eventName = document.createElement("p");
    eventName.classList.add("registration-event");
    eventName.textContent = registration.event;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Remove";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
        removeRegistration(registration.id, item);
    });

    item.dataset.id = registration.id;

    item.appendChild(avatar);
    item.appendChild(info);
    item.appendChild(eventName);
    item.appendChild(deleteButton);

    registrationList.appendChild(item);

    updateRegistrationCount();
}

// Delete a registration.
function removeRegistration(id, item) {
    const index = registrations.findIndex(function (registration) {
        return registration.id === id;
    });

    if (index !== -1) {
        registrations.splice(index, 1);
    }

    item.remove();

    updateRegistrationCount();
}

// Update the number of registrations.
function updateRegistrationCount() {
    registrationCount.textContent = registrations.length;

    if (registrations.length === 0) {
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }
}