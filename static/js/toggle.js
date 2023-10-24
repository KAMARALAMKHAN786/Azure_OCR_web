// Get references to the Invoice and Custom Template buttons
const invoiceButton = document.querySelector('button[data-target="invoice"]');
const customTemplateButton = document.querySelector('#custom-template-button');

// Add a click event listener to the Custom Template button
customTemplateButton.addEventListener('click', function () {
    if (!customTemplateButton.classList.contains('active')) {
        // Toggle the active class on the buttons
        invoiceButton.classList.remove('active');
        customTemplateButton.classList.add('active');
    }
});

// Add a click event listener to the Invoice button
invoiceButton.addEventListener('click', function () {
    if (!invoiceButton.classList.contains('active')) {
        // Toggle the active class on the buttons
        customTemplateButton.classList.remove('active');
        invoiceButton.classList.add('active');
    }
});