const validTokens = {
    'fb3a921d7e8c456a': 'nopaga',
    'c8f2b19a3d4e675b': 'paga'
};

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('ref');

if (!validTokens[token]) {
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; padding: 20px; font-family: 'Share Tech Mono', monospace; background-color: var(--bg-light);">
            <h1 style="color: var(--primary-color); margin-bottom: 20px; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); font-size: 2.5rem;">⚠️ Acceso Denegado</h1>
            <p style="color: var(--text-dark); max-width: 400px; line-height: 1.6; font-family: 'Montserrat', sans-serif; font-size: 1.1rem;">El enlace de invitación está incompleto o es incorrecto.<br><br>Por favor, ingresá usando el link exacto que te envié por WhatsApp para ver la invitación.</p>
        </div>
    `;
    document.body.style.visibility = 'visible';
    throw new Error("Invalid access token");
}

document.body.style.visibility = 'visible';
const isPaga = validTokens[token] === 'paga';

const countdownDate = new Date("Mar 28, 2026 12:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        if (typeof countdownInterval !== 'undefined') clearInterval(countdownInterval);
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        const countdownContainer = document.getElementById("countdown");
        if (countdownContainer) {
            countdownContainer.innerHTML = "<h2 style='font-family: \"Share Tech Mono\", monospace; font-size: 2.5rem; color: var(--accent-color); text-shadow: 0 0 10px rgba(32, 201, 151, 0.5);'>¡Llegó el gran día!</h2>";
        }
        return;
    }

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
reveal();

const form = document.getElementById('rsvp-form');
const asisInput = document.getElementById('asistencia');
const btnYes = document.querySelector('button.btn-yes');
const btnNo = document.querySelector('button.btn-no');
const formMessage = document.getElementById('form-message');
const nombreInput = document.getElementById('nombre');

if (localStorage.getItem('rsvpSubmitted') === 'true') {
    if (nombreInput) nombreInput.disabled = true;
    if (btnYes) btnYes.disabled = true;
    if (btnNo) btnNo.disabled = true;
    if (formMessage) {
        formMessage.textContent = 'Ya respondiste a la invitación. ¡Gracias!';
        formMessage.className = 'form-message success';
    }
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbywoMV4VeCdmmQqoAiSt_RiHndLOP-db2XW2CqyXIfH6sv4KVp8x8mhqeUsvoGg4L81/exec';

function submitForm(asistenciaValue) {
    if (localStorage.getItem('rsvpSubmitted') === 'true') {
        return;
    }
    if (!form) return;

    const nombreInput = document.getElementById('nombre');

    if (nombreInput.value.trim().toLowerCase() === 'carmu') {
        document.getElementById('easter-egg-modal').style.display = 'flex';
        return;
    }

    if (!nombreInput.value.trim()) {
        formMessage.textContent = 'Por favor, escribí tu nombre primero.';
        formMessage.className = 'form-message error';
        nombreInput.focus();
        return;
    }

    asisInput.value = asistenciaValue;
    btnYes.disabled = true;
    btnNo.disabled = true;

    const checkboxBelenes = document.getElementById('checkbox-belenes');
    const inputBelenes = document.getElementById('input-belenes');
    if (checkboxBelenes && inputBelenes) {
        inputBelenes.value = checkboxBelenes.checked ? 'Si' : 'No';
    }

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
                formMessage.textContent = 'Cool 😎. Nos vemos pronto para festejar.';
            } else {
                formMessage.textContent = 'Qué lástima 😔.';
            }
            formMessage.className = 'form-message success';
            btnYes.innerHTML = '<i class="fas fa-check"></i> Enviado';
            btnNo.innerHTML = '<i class="fas fa-check"></i> Enviado';
            form.reset();

            localStorage.setItem('rsvpSubmitted', 'true');
            if (nombreInput) nombreInput.disabled = true;
            if (btnYes) btnYes.disabled = true;
            if (btnNo) btnNo.disabled = true;
        })
        .catch(error => {
            console.error('Error!', error.message);
            formMessage.textContent = 'Hubo un error al enviar. Por favor intentá de nuevo.';
            formMessage.className = 'form-message error';
            btnYes.disabled = false;
            btnNo.disabled = false;
            btnYes.innerHTML = '<i class="fas fa-check"></i> ¡Asisto!';
            if (checkboxBelenes && checkboxBelenes.checked) {
                btnNo.innerHTML = '<i class="fas fa-glass-cheers"></i> Voy solo a la fiesta (2am) 🕺🏻';
                btnNo.classList.remove('btn-no');
                btnNo.classList.add('btn-party');
            } else {
                btnNo.innerHTML = '<i class="fas fa-times"></i> No podré ir 😔';
                btnNo.classList.remove('btn-party');
                btnNo.classList.add('btn-no');
            }
        });
}

const titleElement = document.querySelector('.main-title');
if (titleElement) {
    const textToType = "¡Me recibo\nde Médico!";
    titleElement.innerHTML = '<span class="typed-text"></span><span class="cursor" style="animation: blink 1s step-end infinite; color: var(--primary-color);">_</span>';
    const textSpan = titleElement.querySelector('.typed-text');

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < textToType.length) {
            if (textToType.charAt(charIndex) === '\n') {
                textSpan.innerHTML += '<br>';
            } else {
                textSpan.innerHTML += textToType.charAt(charIndex);
            }
            charIndex++;
            setTimeout(typeWriter, Math.floor(Math.random() * 80) + 50);
        }
    }

    setTimeout(typeWriter, 600);
}

function toggleLocation(element) {
    document.querySelectorAll('.clickable-schedule.active-dropdown').forEach(item => {
        if (item !== element) item.classList.remove('active-dropdown');
    });

    element.classList.toggle('active-dropdown');
}

document.addEventListener('DOMContentLoaded', () => {
    const estadoPagoInput = document.getElementById('estado-pago');
    if (estadoPagoInput) {
        estadoPagoInput.value = isPaga ? 'Sin pagar' : 'No paga';
    }

    const checkboxBelenes = document.getElementById('checkbox-belenes');
    const belenesDropdown = document.getElementById('belenes-dropdown');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const nombreInput = document.getElementById('nombre');

    if (checkboxBelenes) {
        checkboxBelenes.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (belenesDropdown) belenesDropdown.style.display = 'block';
                if (btnNo) {
                    btnNo.innerHTML = '<i class="fas fa-glass-cheers"></i> Voy solo a la fiesta (2am) 🕺🏻';
                    btnNo.classList.remove('btn-no');
                    btnNo.classList.add('btn-party');
                }
            } else {
                if (belenesDropdown) belenesDropdown.style.display = 'none';
                if (btnNo) {
                    btnNo.innerHTML = '<i class="fas fa-times"></i> No podré ir 😔';
                    btnNo.classList.remove('btn-party');
                    btnNo.classList.add('btn-no');
                }
            }
        });
    }

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let mensaje = "Decime como anotarme en la lista para ir a Los Belenes capo. y cuantos invitados puedo llevar.";
            const whatsappUrl = `https://wa.me/5492284320801?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    if (isPaga) {
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) {
            paymentSection.style.display = 'block';
        }
    }
});

function copyText(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector(`button[onclick="copyText('${elementId}')"]`);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

if (musicToggle && bgMusic) {
    bgMusic.volume = 0.5;

    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isMusicPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.title = "Pausar música";
            musicToggle.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.6)";
        }).catch(error => {
            console.log("Autoplay prevented by browser. User interaction is needed.");
            isMusicPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        });
    }

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.title = "Reproducir música";
            musicToggle.style.boxShadow = "0 0 10px rgba(0, 229, 255, 0.2)";
        } else {
            bgMusic.play().catch(e => {
                console.log("Audio play failed:", e);
            });
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.title = "Pausar música";
            musicToggle.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.6)";
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

function closeEasterEgg() {
    const modal = document.getElementById('easter-egg-modal');
    if (modal) {
        modal.style.display = 'none';
        const nombreInput = document.getElementById('nombre');
        if (nombreInput) {
            nombreInput.value = '';
            nombreInput.focus();
        }
    }
}
