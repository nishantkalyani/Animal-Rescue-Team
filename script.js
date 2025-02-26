// ==================== Image Upload Functionality ====================
document.querySelectorAll('input[name="image-source"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const urlSection = document.getElementById('url-upload-section');
        const fileSection = document.getElementById('file-upload-section');
        
        if (radio.value === 'url') {
            urlSection.style.display = 'block';
            fileSection.style.display = 'none';
            document.getElementById('animal-image').required = true;
            document.getElementById('animal-image-file').required = false;
        } else {
            urlSection.style.display = 'none';
            fileSection.style.display = 'block';
            document.getElementById('animal-image').required = false;
            document.getElementById('animal-image-file').required = true;
        }
    });
});

// ==================== Add Animal Form Handling ====================
document.getElementById('add-animal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('animal-name').value;
    const breed = document.getElementById('animal-breed').value;
    const age = document.getElementById('animal-age').value;
    const imageSource = document.querySelector('input[name="image-source"]:checked').value;

    const handleImage = (callback) => {
        if (imageSource === 'url') {
            const imageUrl = document.getElementById('animal-image').value;
            callback(imageUrl);
        } else {
            const fileInput = document.getElementById('animal-image-file');
            if (fileInput.files[0]) {
                if (fileInput.files[0].size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    };

    handleImage((imageSrc) => {
        const animalList = document.getElementById('animal-list');
        const newAnimalDiv = document.createElement('div');
        newAnimalDiv.classList.add('animal');
        newAnimalDiv.innerHTML = `
            <h3>${name}</h3>
            <img src="${imageSrc}" alt="${name}">
            <p>Breed: ${breed}</p>
            <p>Age: ${age}</p>
            <button class="adopt-button">Adopt ${name}</button>
        `;

        animalList.appendChild(newAnimalDiv);
        const adoptButton = newAnimalDiv.querySelector('.adopt-button');
        adoptButton.addEventListener('click', () => handleAdoption(name, newAnimalDiv));

        document.getElementById('add-animal-response').innerHTML = 
            `<p style="color: green;">${name} has been added successfully!</p>`;
        this.reset();
        
        // Reset image source toggle
        document.getElementById('url-upload-section').style.display = 'block';
        document.getElementById('file-upload-section').style.display = 'none';
        document.querySelector('input[name="image-source"][value="url"]').checked = true;
    });
});

// ==================== Adoption Functionality ====================
function handleAdoption(animalName, animalElement) {
    const popup = document.getElementById('adoption-popup');
    const closeButton = document.querySelector('.close-button');
    const adoptionForm = document.getElementById('adoption-form');
    const adoptionResponse = document.getElementById('adoption-response');

    popup.style.display = 'block';

    closeButton.onclick = function() {
        popup.style.display = 'none';
        adoptionResponse.innerHTML = '';
    };

    adoptionForm.onsubmit = function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        
        // Google Form submission code (same as original)
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfuY7OuY3LiJvGp2aAAgzr81GVXDp5J80GwrAT7Z58r0_Td9w/formResponse';
        const urlParams = new URLSearchParams({
            'entry.1521758943': formData.get('adopter-name'),
            'entry.767450495': formData.get('adopter-email'),
            'entry.1775960656': formData.get('adopter-message'),
            'entry.857201661': formData.get('adopter-contact')
        });

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: urlParams
        })
        .then(() => {
            const adopterName = formData.get('adopter-name'); // Get the adopter's name
            adoptionResponse.innerHTML = `<p>Thank you ${adopterName} for adopting ${animalName}!</p>`;
            animalElement.remove();
            this.reset();
        })
        .catch(() => {
            adoptionResponse.innerHTML = `<p style="color: red;">Error submitting form. Please try again.</p>`;
        });
    };
}

// Initialize existing adopt buttons
document.querySelectorAll('.adopt-button').forEach(button => {
    const animalElement = button.closest('.animal');
    const animalName = button.textContent.replace('Adopt ', '');
    button.addEventListener('click', () => handleAdoption(animalName, animalElement));
});

// ==================== Contact Form Handling ====================
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    
    // Google Form submission code (same as original)
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfuY7OuY3LiJvGp2aAAgzr81GVXDp5J80GwrAT7Z58r0_Td9w/formResponse';
    const urlParams = new URLSearchParams({
        'entry.1521758943': formData.get('name'),
        'entry.767450495': formData.get('email'),
        'entry.1775960656': formData.get('message'),
        'entry.857201661': formData.get('contact-number')
    });

    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: urlParams
    })
    .then(() => {
        document.getElementById('form-response').innerHTML = 
            `<p style="color: green;">Thank you! Your message has been recorded.</p>`;
        this.reset();
    })
    .catch(() => {
        document.getElementById('form-response').innerHTML = 
            `<p style="color: red;">Error submitting form. Please try again.</p>`;
    });
});
