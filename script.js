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
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// IMPORTANTE: REEMPLAZAR ESTA URL CON LA QUE TE DÉ GOOGLE APPS SCRIPT
const scriptURL = 'https://script.google.com/macros/s/AKfycbywoMV4VeCdmmQqoAiSt_RiHndLOP-db2XW2CqyXIfH6sv4KVp8x8mhqeUsvoGg4L81/exec';

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        // Evitamos enviar si el link no fue configurado
        if (scriptURL === 'AQUI_VA_TU_LINK_DE_GOOGLE_APPS_SCRIPT') {
            formMessage.textContent = '¡Falta configurar el link de Google Sheets! (mirá el código)';
            formMessage.className = 'form-message error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                formMessage.textContent = '¡Gracias por confirmar! Nos vemos pronto.';
                formMessage.className = 'form-message success';
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado';
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                formMessage.textContent = 'Hubo un error al enviar. Por favor intentá de nuevo.';
                formMessage.className = 'form-message error';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Confirmación';
            });
    });
}
