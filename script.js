const m = document.querySelector('.menu'),
      n = document.querySelector('nav');

if (m) {
    m.onclick = () => n.classList.toggle('open');
}

const p = document.getElementById('purpose'),
      b = document.getElementById('bank');

function showBank() {
    if (b && p) {
        b.style.display = p.value === 'Bank Loan' ? 'grid' : 'none';
    }
}

if (p) {
    p.onchange = showBank;
    showBank();
}


/* ================================
   APNATEHSIL REQUEST SUBMISSION
   Trial WhatsApp Number:
   +91 9540234567
================================ */

function submitRequest() {

    const form = document.querySelector('.formbox');

    if (!form) {
        alert('Request form not found.');
        return;
    }

    const labels = form.querySelectorAll('.formgrid label');

    let message = "🌐 *NEW APNATEHSIL REQUEST*%0A";
    message += "━━━━━━━━━━━━━━━━━━━━%0A";

    labels.forEach(label => {

        const field = label.querySelector('input, select, textarea');

        if (!field) return;

        const fieldName = label.childNodes[0].textContent.trim();

        let value = field.value.trim();

        if (!value) {
            value = "Not provided";
        }

        // Don't include hidden bank details when purpose is not Bank Loan
        if (label.closest('#bank') && p && p.value !== 'Bank Loan') {
            return;
        }

        message += "%0A*" + encodeURIComponent(fieldName) + "*: ";
        message += encodeURIComponent(value);
    });

    message += "%0A%0A━━━━━━━━━━━━━━━━━━━━";
    message += "%0APlease contact the customer to confirm charges and payment.";
    message += "%0A%0A*ApnaTehsil.com*";

    const whatsappNumber = "919540234567";

    const whatsappURL =
        "https://wa.me/" + whatsappNumber + "?text=" + message;

    window.open(whatsappURL, "_blank");
}
