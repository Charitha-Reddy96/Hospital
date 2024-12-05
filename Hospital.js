document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("main section");
    const slides = document.querySelectorAll(".slide");
    const cartIcon = document.getElementById("cart-icon");
    const cartCount = document.getElementById("cart-count");
    const cartOverlay = document.getElementById("cart-overlay");
    const closeCart = document.querySelector(".close-cart");
    const cartList = document.getElementById("cart-list");
    const totalCostDisplay = document.getElementById("total-cost");
    let slideIndex = 0;
    let cart = [];
    let totalCost = 0;

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove("active");
            if (section.id === targetId) {
                section.classList.add("active");
            }
        });
    }

    function showSlides() {
        slides.forEach((slide, index) => {
            slide.style.display = (index === slideIndex) ? "block" : "none";
        });
        slideIndex = (slideIndex + 1) % slides.length;
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }

    links.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            showSection(targetId);
        });
    });
/*Cart */

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.getAttribute("data-product");
            const price = parseFloat(this.getAttribute("data-price"));
            const productIndex = cart.findIndex(item => item.product === product);
            if (productIndex > -1) {
                cart[productIndex].quantity += 1;
            } else {
                cart.push({ product, price, quantity: 1 });
            }
            cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
            updateCartDisplay();
        });
    });

    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.getAttribute("data-product");
            const price = parseFloat(this.getAttribute("data-price"));
            cart = [{ product, price, quantity: 1 }];
            totalCost = price;
            showSection("payment");
        });
    });

    cartIcon.addEventListener("click", () => {
        cartOverlay.style.display = "flex";
        updateCartDisplay();
    });

    closeCart.addEventListener("click", () => {
        cartOverlay.style.display = "none";
    });

    document.getElementById("cart-buy-now").addEventListener("click", () => {
        showSection("payment");
        cartOverlay.style.display = "none";
    });

    function updateCartDisplay() {
        cartList.innerHTML = "";
        totalCost = 0;
        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <img src="product1.jpg" alt="${item.product}">
                <div class="item-details">
                    <h4>${item.product}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    Quantity: <input type="number" value="${item.quantity}" min="1">
                </div>
            `;
            cartList.appendChild(listItem);
            totalCost += item.price * item.quantity;
        });
        totalCostDisplay.textContent = `Total: $${totalCost.toFixed(2)}`;
    }

    document.querySelectorAll("input[name='payment-method']").forEach(radio => {
        radio.addEventListener("change", function() {
            document.querySelectorAll(".payment-details").forEach(div => {
                div.style.display = "none";
            });
            document.getElementById(`${this.value}-details`).style.display = "block";
        });
    });

    showSlides();
});

/*services */
document.addEventListener("DOMContentLoaded", function() {
    const patientForm = document.getElementById("patient-form");
    const retrieveForm = document.getElementById("retrieve-form");
    const patientDetails = document.getElementById("patient-details");
    const printButton = document.getElementById("print-button");
    const modal = document.getElementById("confirmation-modal");
    const modalMessage = document.getElementById("confirmation-message");
    const printModalButton = document.getElementById("print-modal-button");
    const closeModal = document.querySelector(".close");

    let patients = JSON.parse(localStorage.getItem("patients")) || [];

    function generateUniqueId() {
        return 'P' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    function savePatientData(patient) {
        patients.push(patient);
        localStorage.setItem("patients", JSON.stringify(patients));
    }

    function getPatientById(id) {
        // Find patient by ID (case-insensitive)
        return patients.find(patient => patient.id.toUpperCase() === id.toUpperCase());
    }

    function determineHealthStatus(age, medication, diseases) {
        age = parseInt(age);
        if (age < 18 || medication.trim() !== "" || diseases.trim() !== "") {
            return "POOR";
        } else if (age >= 18 && age <= 60 && medication.trim() === "" && diseases.trim() === "") {
            return "GOOD";
        } else if (age > 60 && medication.trim() === "" && diseases.trim() === "") {
            return "PERFECTLY ALRIGHT";
        }
        return "UNKNOWN";
    }

    patientForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("patient-name").value;
        const age = document.getElementById("patient-age").value;
        const medication = document.getElementById("patient-medication").value;
        const diseases = document.getElementById("patient-diseases").value;
        const medicalHistory = document.getElementById("medical-history").value;
        const possibleScenarios = document.getElementById("possible-scenarios").value;
        const id = generateUniqueId();

        const healthStatus = determineHealthStatus(age, medication, diseases);
        const patient = { id, name, age, medication, diseases, medicalHistory, possibleScenarios, healthStatus };
        savePatientData(patient);

        const confirmationMessage = `Patient data saved with ID: ${id}\nHealth Status: ${healthStatus}`;
        modalMessage.textContent = confirmationMessage;
        modal.style.display = "block";

        // Reset form and show print button
        patientForm.reset();
        printButton.style.display = "block";
    });

    retrieveForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const id = document.getElementById("patient-id").value;
        const patient = getPatientById(id);

        if (patient) {
            patientDetails.innerHTML = `
                <h3>Patient Details</h3>
                <p><strong>ID:</strong> ${patient.id}</p>
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Medication:</strong> ${patient.medication}</p>
                <p><strong>Diseases:</strong> ${patient.diseases}</p>
                <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
                <p><strong>Possible Scenarios and Outcomes:</strong> ${patient.possibleScenarios}</p>
                <p><strong>Health Status:</strong> ${patient.healthStatus}</p>
            `;
            printButton.style.display = "block"; // Show print button upon successful retrieval
        } else {
            patientDetails.innerHTML = `<p>No patient found with ID: ${id}</p>`;
            printButton.style.display = "none"; // Hide print button if no patient found
        }
    });

    printModalButton.addEventListener("click", function() {
        window.print();
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

/*  Check Reports */

document.addEventListener("DOMContentLoaded", function() {
    const uploadReportsBtn = document.getElementById("upload-reports-btn");
    const checkReportsBtn = document.getElementById("check-reports-btn");
    const uploadModal = document.getElementById("upload-reports-modal");
    const checkModal = document.getElementById("check-reports-modal");
    const uploadForm = document.getElementById("upload-reports-form");
    const checkForm = document.getElementById("check-reports-form");
    const closeButtons = document.querySelectorAll(".close");

    // Show Upload Reports Modal
    uploadReportsBtn.addEventListener("click", function() {
        uploadModal.style.display = "block";
    });

    // Show Check Reports Modal
    checkReportsBtn.addEventListener("click", function() {
        checkModal.style.display = "block";
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener("click", function() {
            uploadModal.style.display = "none";
            checkModal.style.display = "none";
        });
    });

    // Upload Reports Form Submission
    uploadForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Handle form submission logic (e.g., send data to server)
        alert("Reports uploaded successfully!");
        uploadModal.style.display = "none";
        uploadForm.reset();
    });

    // Check Reports Form Submission
    checkForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Handle form submission logic (e.g., fetch data from server)
        const patientId = document.getElementById("check-patient-id").value;
        // Simulated response
        const fakeReportLink = `http://example.com/reports/${patientId}`;
        const checkResults = document.getElementById("check-results");
        checkResults.innerHTML = `
            <p>Reports found for Patient ID: ${patientId}</p>
            <p>Download report: <a href="${fakeReportLink}" target="_blank">Report Link</a></p>
        `;
        checkForm.reset();
    });
});


/* Departments*/

document.addEventListener("DOMContentLoaded", function() {
    const expertBoxes = document.querySelectorAll(".expert-box");
    const appointmentSection = document.getElementById("appointment-section");
    const dateSection = document.getElementById("date-section");
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"]; // Predefined time slots

    expertBoxes.forEach(box => {
        const button = box.querySelector(".book-appointment");
        button.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent click event from bubbling up

            // Display selected doctor's details in the appointment section
            const doctorImg = box.querySelector("img").src;
            const doctorName = box.querySelector("h4").textContent;
            const expertise = box.querySelector(".expert-info p").textContent;

            document.getElementById("selected-doctor-img").src = doctorImg;
            document.getElementById("selected-doctor-name").textContent = doctorName;
            document.getElementById("selected-doctor-expertise").textContent = expertise;

            // Show appointment section only within departments section
            appointmentSection.style.display = "block";
            appointmentSection.classList.add("active");

            // Populate dates dynamically
            populateDates();
        });
    });

    function populateDates() {
        const today = new Date();
        const numberOfDays = 30; // Displaying dates for the next 30 days
        dateSection.innerHTML = ""; // Clear previous dates

        for (let i = 0; i < numberOfDays; i++) {
            const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
            const dateString = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const dateElement = document.createElement("div");
            dateElement.classList.add("date");
            dateElement.textContent = dateString;
            dateElement.dataset.date = date.toISOString().split("T")[0]; // Store date in dataset

            dateElement.addEventListener("click", function() {
                // Toggle selection effect
                const selected = document.querySelector(".date.selected");
                if (selected) {
                    selected.classList.remove("selected");
                }
                this.classList.add("selected");

                const selectedDate = this.dataset.date;
                const timeSlotContainer = document.querySelector(".time-slots");
                populateTimeSlots(timeSlotContainer);
            });

            dateSection.appendChild(dateElement);
        }
    }

    function populateTimeSlots(container) {
        container.innerHTML = ""; // Clear previous time slots

        timeSlots.forEach(slot => {
            const slotElement = document.createElement("div");
            slotElement.classList.add("time-slot");
            slotElement.textContent = slot;

            slotElement.addEventListener("click", function() {
                // Toggle selection effect
                const selected = document.querySelector(".time-slot.selected");
                if (selected) {
                    selected.classList.remove("selected");
                }
                this.classList.add("selected");
            });

            container.appendChild(slotElement);
        });
    }

    // Close appointment section if clicked outside
    document.addEventListener("click", function(event) {
        if (!appointmentSection.contains(event.target)) {
            appointmentSection.style.display = "none";
            appointmentSection.classList.remove("active");
        }
    });

    // Initial setup
    populateDates();
});


/*Advances facitlities*/
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}


/*Donations*/

document.addEventListener('DOMContentLoaded', () => {
    const donationBoxes = document.querySelectorAll('.donation-box');
    const modal = document.getElementById('donation-form-modal');
    const closeButton = document.querySelector('.close-button');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeConfirmationButton = document.querySelector('.close-confirmation-button');
    const form = document.getElementById('donation-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    donationBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const donationType = box.getAttribute('data-type');
            document.getElementById('donation-type').value = donationType;
            modal.style.display = 'block';
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        modal.style.display = 'none';
        confirmationMessage.textContent = 'Thank you! We will contact you soon.';
        confirmationModal.style.display = 'block';
    });

    closeConfirmationButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});



/*About-us*/

document.addEventListener("DOMContentLoaded", function() {
    const serviceBoxes = document.querySelectorAll('.service-box');
    let delay = 0;

    serviceBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.display = 'block';
            box.classList.add('fade-in');
        }, delay);
        delay += 500; // Adjust the delay for the appearance of each box
    });
});


/*Home page*/
document.addEventListener("DOMContentLoaded", function() {
    // Select the Home section element
    const homeSection = document.getElementById("home");

    // Function to show the Home section
    function showHomeSection() {
        // Hide all sections except the Home section
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            if (section.id === "home") {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }

    // Call the function to show Home section when the page loads
    showHomeSection();

    // Event listener for navigation links
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            showSection(targetId);
        });
    });

    // Function to show sections based on targetId
    function showSection(targetId) {
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    }
});


/*Panic buttons */

document.addEventListener("DOMContentLoaded", function() {
    const panicButton = document.getElementById("panic-button");
    const emergencyModal = document.getElementById("emergency-modal");
    const closeButton = document.querySelector(".close-button");

    panicButton.addEventListener("click", function() {
        emergencyModal.style.display = "block";
    });

    closeButton.addEventListener("click", function() {
        emergencyModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === emergencyModal) {
            emergencyModal.style.display = "none";
        }
    });
});

