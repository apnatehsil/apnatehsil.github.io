const m = document.querySelector('.menu');
const n = document.querySelector('nav');

if (m) {
    m.onclick = () => n.classList.toggle('open');
}

const p = document.getElementById('purpose');
const b = document.getElementById('bank');

function showBank() {
    if (b && p) {
        b.style.display = p.value === 'Bank Loan' ? 'grid' : 'none';
    }
}

if (p) {
    p.onchange = showBank;
    showBank();
}


/* =========================================
   APNATEHSIL CUSTOMER ORDER SUBMISSION
   ========================================= */

async function submitRequest() {

    const formBox = document.querySelector('.formbox');
    const button = document.querySelector('.formbox .btn.primary');

    if (!formBox) {
        alert('Request form not found.');
        return;
    }

    // Prevent double submission
    if (button) {
        button.disabled = true;
        button.textContent = 'Submitting...';
    }

    // Open WhatsApp window immediately so browser doesn't block it
    const waWindow = window.open('about:blank', '_blank');

    const fields = formBox.querySelectorAll(
        '.formgrid > label, .formgrid #bank label'
    );

    const order = {};

    fields.forEach(label => {

        const field = label.querySelector('input, select, textarea');

        if (!field) return;

        const labelText = label.childNodes[0]?.textContent
            ?.trim()
            .replace('*', '')
            .trim();

        let value = field.value.trim();

        if (!value) {
            value = 'Not provided';
        }

        // Ignore bank details if purpose is not Bank Loan
        if (
            label.closest('#bank') &&
            p &&
            p.value !== 'Bank Loan'
        ) {
            return;
        }

        order[labelText] = value;
    });


    /* =========================================
       CREATE ORDER MESSAGE
       ========================================= */

    let message =
`🌐 APNA TEHSIL - NEW CUSTOMER REQUEST

━━━━━━━━━━━━━━━━━━━━
REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━

`;

    Object.entries(order).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
    });

    message += `
━━━━━━━━━━━━━━━━━━━━
PAYMENT
━━━━━━━━━━━━━━━━━━━━

Payment method: Cash on visit

Please contact the customer to confirm charges and processing.

ApnaTehsil.com
`;


    /* =========================================
       SEND ORDER TO FORMSPREE
       ========================================= */

    const formData = new FormData();

    formData.append(
        '_subject',
        'New ApnaTehsil Customer Request'
    );

    formData.append(
        'request_type',
        'ApnaTehsil Customer Order'
    );

    formData.append(
        'order_details',
        message
    );


    // Also send every individual field
    Object.entries(order).forEach(([key, value]) => {
        formData.append(key, value);
    });


    try {

        const response = await fetch(
            'https://formspree.io/f/xkjgovkv',
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );


        if (!response.ok) {

            let errorMessage = 'Unable to submit the request.';

            try {
                const data = await response.json();

                if (data.errors && data.errors.length) {
                    errorMessage = data.errors
                        .map(error => error.message)
                        .join('\n');
                }

            } catch (e) {}

            if (waWindow) {
                waWindow.close();
            }

            alert(
                'Request could not be submitted.\n\n' +
                errorMessage +
                '\n\nPlease try again.'
            );

            if (button) {
                button.disabled = false;
                button.textContent = 'Submit Request →';
            }

            return;
        }


        /* =========================================
           OPEN WHATSAPP AFTER EMAIL SUCCESS
           ========================================= */

        const whatsappNumber = '919540234567';

        const whatsappURL =
            'https://wa.me/' +
            whatsappNumber +
            '?text=' +
            encodeURIComponent(message);

        if (waWindow) {
            waWindow.location.href = whatsappURL;
        } else {
            window.location.href = whatsappURL;
        }


        alert(
            'Request submitted successfully!\n\n' +
            'Your requirement has been received by ApnaTehsil. ' +
            'WhatsApp will now open so the request can also be shared with our representative.'
        );


        // Reset form after successful submission
        const inputs = formBox.querySelectorAll(
            'input, select, textarea'
        );

        inputs.forEach(field => {
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        });

        if (p) {
            p.value = 'Bank Loan';
            showBank();
        }


    } catch (error) {

        if (waWindow) {
            waWindow.close();
        }

        alert(
            'There was a connection problem.\n\n' +
            'Please try again.'
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = 'Submit Request →';
        }
    }
}
