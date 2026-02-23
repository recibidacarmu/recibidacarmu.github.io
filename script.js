// Countdown Timer logic
const countdownDate = new Date("Mar 28, 2026 12:00:00").getTime();

const countdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Default to 0 if we passed the date
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        const countdownContainer = document.getElementById("countdown");
        countdownContainer.innerHTML = "<h2 style='font-family: \"Playfair Display\", serif; font-size: 2.5rem; color: var(--accent-color);'>¡Llegó el gran día!</h2>";
        return;
    }

    // Display
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

}, 1000);

// Scroll Animations (Reveal elements on scroll)
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; // Trigger slightly earlier for better UX

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
// Trigger once on load
reveal();

// RSVP Form Logic
const form = document.getElementById('rsvp-form');
const asisInput = document.getElementById('asistencia');
const btnYes = document.querySelector('.btn-yes');
const btnNo = document.querySelector('.btn-no');
const formMessage = document.getElementById('form-message');

const scriptURL = 'https://script.google.com/macros/library/d/13otkG7WF7ZVJt0iQydYgXNRgkpYbYeTknRfuejKak807Vx5tQYUtZWP0/2';

function submitForm(asistenciaValue) {
    if (!form) return;

    // Validar nombre
    const nombreInput = document.getElementById('nombre');
    if (!nombreInput.value.trim()) {
        formMessage.textContent = 'Por favor, escribí tu nombre primero.';
        formMessage.className = 'form-message error';
        nombreInput.focus();
        return;
    }

    // Set hidden value and update UI
    asisInput.value = asistenciaValue;
    btnYes.disabled = true;
    btnNo.disabled = true;

    if (asistenciaValue === 'Si') {
        btnYes.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    } else {
        btnNo.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }

    formMessage.textContent = '';
    formMessage.className = 'form-message';

    fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
        .then(response => {
            if (asistenciaValue === 'Si') {
                formMessage.textContent = '¡Qué bueno! Nos vemos pronto para festejar.';
            } else {
                formMessage.textContent = '¡Qué lástima! Nos veremos la próxima.';
            }
            formMessage.className = 'form-message success';
            btnYes.innerHTML = '<i class="fas fa-check"></i> Enviado';
            btnNo.innerHTML = '<i class="fas fa-check"></i> Enviado';
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            formMessage.textContent = 'Hubo un error al enviar. Por favor intentá de nuevo.';
            formMessage.className = 'form-message error';
            btnYes.disabled = false;
            btnNo.disabled = false;
            btnYes.innerHTML = '<i class="fas fa-check"></i> ¡Asisto!';
            btnNo.innerHTML = '<i class="fas fa-times"></i> No podré ir';
        });
}
