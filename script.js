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
   APNATEHSIL ORDER SYSTEM
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

        // Ignore hidden bank fields when purpose is not Bank Loan
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

        const requiredFields = [
            'District',
            'Tehsil',
            'Village / Location',
            'Owner Name',
            'Customer Name',
            'Mobile Number',
            'Bank Branch'
        ];

        if (
            requiredFields.includes(label) &&
            !value
        ) {
            missing.push(label);
        }

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
       GENERATE UNIQUE ORDER ID
       ========================================= */

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const random = Math.floor(100 + Math.random() * 900);

    const orderId =
        `AT-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;

    const date =
        `${day}-${month}-${year}`;

    const time =
        now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });


    /* =========================================
       CREATE WHATSAPP MESSAGE
       ========================================= */

    let message =
`🌐 *APNATEHSIL - NEW CUSTOMER REQUEST*

━━━━━━━━━━━━━━━━━━━━
*ORDER ID:* ${orderId}
*DATE:* ${date}
*TIME:* ${time}
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
       SEND TO GOOGLE SHEETS
       ========================================= */

    const googleScriptURL =
        'https://script.google.com/macros/s/AKfycbyGSaUI59n53nlCTnC5wFSeCoBMGjW8oqE5gVWY4PSPhMoC9Tex1WRy66GltPKKX4Qw/exec';


    const sheetData = {

        orderId: orderId,
        date: date,
        time: time,

        service: order['Service Required'] || '',
        processing: order['Processing Option'] || '',
        district: order['District'] || '',
        tehsil: order['Tehsil'] || '',
        village: order['Village / Location'] || '',
        owner: order['Owner Name'] || '',
        khasra: order['Khewat / Khatoni / Khasra'] || '',
        customer: order['Customer Name'] || '',
        mobile: order['Mobile Number'] || '',
        purpose: order['Purpose'] || '',
        bank: order['Bank Name'] || '',
        branch: order['Bank Branch'] || '',
        additional: order['Additional Information'] || ''
    };


    /* =========================================
       SEND DATA TO GOOGLE APPS SCRIPT
       ========================================= */

    fetch(googleScriptURL, {

        method: 'POST',

        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },

        body: JSON.stringify(sheetData)

    }).catch(error => {

        console.log(
            'Google Sheet submission error:',
            error
        );

    });


    /* =========================================
       OPEN WHATSAPP
       ========================================= */

    const whatsappNumber =
        '919540234567';

    const whatsappURL =
        'https://wa.me/' +
        whatsappNumber +
        '?text=' +
        encodeURIComponent(message);

    window.open(
        whatsappURL,
        '_blank'
    );


    /* =========================================
       SHOW ORDER ID
       ========================================= */

    setTimeout(() => {

        alert(
            'Request created successfully!\n\n' +
            'Order ID: ' + orderId +
            '\n\n' +
            'Please press SEND in WhatsApp to submit the request.'
        );

    }, 700);
}
