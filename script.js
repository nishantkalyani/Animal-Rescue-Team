// =============================================
// Adoption Functionality (Max + New Animals)
// =============================================

// Function to handle animal adoption
function handleAdoption(animalName, buttonElement) {
    alert(`Thank you for adopting ${animalName}!`);
    buttonElement.closest('.animal').remove(); // Safely remove animal card
}

// Initialize adoption buttons for existing animals (like Max)
document.querySelectorAll('.adopt-button').forEach(button => {
    const animalName = button.textContent.replace('Adopt ', '');
    button.addEventListener('click', () => handleAdoption(animalName, button));
});

// =============================================
// Add New Animal Form Handling
// =============================================

document.getElementById('add-animal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('animal-name').value;
    const breed = document.getElementById('animal-breed').value;
    const age = document.getElementById('animal-age').value;
    const imageUrl = document.getElementById('animal-image').value;

    // Create new animal element
    const animalList = document.getElementById('animal-list');
    const newAnimalDiv = document.createElement('div');
    newAnimalDiv.classList.add('animal');
    newAnimalDiv.innerHTML = `
        <h3>${name}</h3>
        <img src="${imageUrl}" alt="${name}">
        <p>Breed: ${breed}</p>
        <p>Age: ${age}</p>
        <button class="adopt-button">Adopt ${name}</button>
    `;

    // Add to page and set up adoption
    animalList.appendChild(newAnimalDiv);
    const adoptButton = newAnimalDiv.querySelector('.adopt-button');
    adoptButton.addEventListener('click', () => handleAdoption(name, adoptButton));

    // Show confirmation and reset form
    document.getElementById('add-animal-response').innerHTML = 
        `<p>${name} has been added successfully!</p>`;
    this.reset();
});

// =============================================
// Contact Form Google Sheets Integration
// =============================================

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const contactNumber = document.getElementById('contact-number').value;

    // Google Form configuration
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfuY7OuY3LiJvGp2aAAgzr81GVXDp5J80GwrAT7Z58r0_Td9w/formResponse';
    const ENTRY_IDS = {
        name: 'entry.1521758943',
        email: 'entry.767450495',
        message: 'entry.1775960656',
        contactNumber: 'entry.857201661'
    };

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append(ENTRY_IDS.name, name);
    formData.append(ENTRY_IDS.email, email);
    formData.append(ENTRY_IDS.message, message);
    formData.append(ENTRY_IDS.contactNumber, contactNumber);

    // Submit to Google Form
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(() => {
        document.getElementById('form-response').innerHTML = `
            <p style="color: green;">Thank you, ${name}! Your message has been recorded.</p>
        `;
        this.reset();
    })
    .catch(() => {
        document.getElementById('form-response').innerHTML = `
            <p style="color: red;">Error submitting form. Please try again.</p>
        `;
    });
});