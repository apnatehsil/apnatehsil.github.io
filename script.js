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
   APNATEHSIL CUSTOMER ORDER
   ========================================= */

function submitRequest() {

    const formBox = document.querySelector('.formbox');

    if (!formBox) {
        alert('Request form not found.');
        return;
    }

    const button = formBox.querySelector('.btn.primary');

    /* -----------------------------------------
       COLLECT FIELDS
       ----------------------------------------- */

    const labels = formBox.querySelectorAll(
        '.formgrid > label, #bank label'
    );

    const order = {};
    let missing = [];

    labels.forEach(label => {

        const field = label.querySelector(
            'input, select, textarea'
        );

        if (!field) return;

        const labelText = label.childNodes[0]?.textContent
            ?.trim()
            .replace('*', '')
            .trim();

        if (!labelText) return;

        let value = field.value.trim();

        /* Bank details only apply to Bank Loan */
        if (
            label.closest('#bank') &&
            p &&
            p.value !== 'Bank Loan'
        ) {
            return;
        }

        /* Check required fields */

        const isRequired =
            labelText.includes('*') ||
            [
                'District',
                'Tehsil',
                'Village / Location',
                'Owner Name',
                'Customer Name',
                'Mobile Number',
                'Bank Branch'
            ].some(name => labelText.startsWith(name));

        if (isRequired && !value) {
            missing.push(labelText.replace('*', '').trim());
            return;
        }

        /* Bank Name validation */

        if (
            labelText.startsWith('Bank Name') &&
            p &&
            p.value === 'Bank Loan' &&
            (value === 'Select Bank' || !value)
        ) {
            missing.push('Bank Name');
            return;
        }

        order[labelText] = value || 'Not provided';
    });


    /* -----------------------------------------
       VALIDATION
       ----------------------------------------- */

    if (missing.length > 0) {

        alert(
            'Please complete the following required fields:\n\n' +
            missing.join('\n')
        );

        return;
    }


    /* -----------------------------------------
       CREATE WHATSAPP MESSAGE
       ----------------------------------------- */

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


    /* -----------------------------------------
       OPEN WHATSAPP
       ----------------------------------------- */

    const whatsappNumber = '919540234567';

    const whatsappURL =
        'https://wa.me/' +
        whatsappNumber +
        '?text=' +
        encodeURIComponent(message);

    if (button) {
        button.disabled = true;
        button.textContent = 'Opening WhatsApp...';
    }

    window.open(
        whatsappURL,
        '_blank'
    );


    /* -----------------------------------------
       SUCCESS MESSAGE
       ----------------------------------------- */

    setTimeout(() => {

        alert(
            'Request prepared successfully!\n\n' +
            'WhatsApp will open with your complete request. ' +
            'Please press SEND in WhatsApp to submit it to ApnaTehsil.'
        );

        if (button) {
            button.disabled = false;
            button.textContent = 'Submit Request →';
        }

    }, 500);
}
