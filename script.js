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
   APNATEHSIL CUSTOMER REQUEST
   ========================================= */

function submitRequest() {

    const formBox = document.querySelector('.formbox');

    if (!formBox) {
        alert('Request form not found.');
        return;
    }

    const fields = formBox.querySelectorAll(
        'input, select, textarea'
    );

    let missing = [];
    let order = {};

    fields.forEach(field => {

        /* Ignore hidden bank section */
        if (
            field.closest('#bank') &&
            p &&
            p.value !== 'Bank Loan'
        ) {
            return;
        }

        let label = '';

        if (field.parentElement) {
            label = field.parentElement.childNodes[0]?.textContent
                ?.trim()
                .replace('*', '')
                .trim();
        }

        if (!label) {
            label = field.name || 'Field';
        }

        let value = field.value.trim();

        /* Required fields */
        const requiredFields = [
            'District',
            'Tehsil',
            'Village / Location',
            'Owner Name',
            'Customer Name',
            'Mobile Number',
            'Bank Branch'
        ];

        if (requiredFields.includes(label) && !value) {
            missing.push(label);
        }

        /* Bank name */
        if (
            label === 'Bank Name' &&
            p &&
            p.value === 'Bank Loan' &&
            (value === '' || value === 'Select Bank')
        ) {
            missing.push('Bank Name');
        }

        order[label] = value || 'Not provided';
    });


    /* =========================================
       VALIDATION
       ========================================= */

    if (missing.length > 0) {

        alert(
            'Please complete the form to send your request.\n\n' +
            'Please fill:\n' +
            missing.join('\n')
        );

        return;
    }


    /* =========================================
       CREATE WHATSAPP MESSAGE
       ========================================= */

    let message =
`🌐 *APNATEHSIL - NEW CUSTOMER REQUEST*

━━━━━━━━━━━━━━━━━━━━
*REQUEST DETAILS*
━━━━━━━━━━━━━━━━━━━━

`;

    Object.entries(order).forEach(([key, value]) => {
        message += `*${key}:* ${value}\n`;
    });

    message +=
`
━━━━━━━━━━━━━━━━━━━━
*PAYMENT*
━━━━━━━━━━━━━━━━━━━━

Payment: Cash on visit

Our representative will contact the customer to confirm charges and processing.

*ApnaTehsil.com*
`;


    /* =========================================
       OPEN WHATSAPP
       ========================================= */

    const whatsappNumber = '919540234567';

    const whatsappURL =
        'https://wa.me/' +
        whatsappNumber +
        '?text=' +
        encodeURIComponent(message);

    window.open(whatsappURL, '_blank');


    /* =========================================
       SUCCESS MESSAGE
       ========================================= */

    setTimeout(() => {

        alert(
            'Your request is ready.\n\n' +
            'WhatsApp will open with your request details. ' +
            'Please press SEND to submit the request to ApnaTehsil.'
        );

    }, 700);
}
