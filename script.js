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
   APNATEHSIL ORDER SUBMISSION
   ========================================= */

async function submitRequest() {

    const formBox = document.querySelector('.formbox');

    if (!formBox) {
        alert('Request form not found.');
        return;
    }

    const button = formBox.querySelector('button');

    if (button) {
        button.disabled = true;
        button.textContent = 'Submitting...';
    }

    /* Collect all form fields */

    const fields = formBox.querySelectorAll(
        'input, select, textarea'
    );

    let orderText =
`🌐 APNATEHSIL - NEW CUSTOMER REQUEST

━━━━━━━━━━━━━━━━━━━━
REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━
`;

    fields.forEach(field => {

        if (field.closest('#bank') &&
            p &&
            p.value !== 'Bank Loan') {
            return;
        }

        let label = field.parentElement
            ? field.parentElement.childNodes[0]?.textContent?.trim()
            : '';

        if (!label) {
            label = field.name || 'Field';
        }

        let value = field.value.trim();

        if (!value) {
            value = 'Not provided';
        }

        orderText +=
            `${label}: ${value}\n`;
    });

    orderText +=
`
━━━━━━━━━━━━━━━━━━━━
PAYMENT
━━━━━━━━━━━━━━━━━━━━

Payment method: Cash on visit

Please contact the customer to confirm charges.

ApnaTehsil.com
`;


    /* =========================================
       SEND EMAIL THROUGH FORMSPREE
       ========================================= */

    const formData = new FormData();

    formData.append(
        '_subject',
        'New ApnaTehsil Customer Order'
    );

    formData.append(
        'message',
        orderText
    );


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

            alert(
                'Sorry, your request could not be submitted. Please try again.'
            );

            if (button) {
                button.disabled = false;
                button.textContent = 'Submit Request →';
            }

            return;
        }


        /* =========================================
           OPEN WHATSAPP
           ========================================= */

        const whatsappNumber = '919540234567';

        const whatsappURL =
            'https://wa.me/' +
            whatsappNumber +
            '?text=' +
            encodeURIComponent(orderText);

        window.open(
            whatsappURL,
            '_blank'
        );


        alert(
            'Request submitted successfully!\\n\\n' +
            'We have received your requirement. ' +
            'Our representative will contact you regarding charges and payment.'
        );


        /* Reset form */

        fields.forEach(field => {

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

        alert(
            'Internet connection problem. Please try again.'
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = 'Submit Request →';
        }
    }
}
