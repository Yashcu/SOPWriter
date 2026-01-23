export const PAYMENT_CONSTANTS = {
    QR_ALT_TEXT: "UPI QR Code",
    QR_NOT_WORKING_MSG: "QR not working? You can pay directly to :",
    UPI_LABEL: "UPI ID",
    COPY_TO_CLIPBOARD: "Tap to copy",
    INSTRUCTIONS_TITLE: "How to Pay with UPI",
    STEPS: [
        {
            step: 1,
            text: "Open any UPI app (PhonePe, Google Pay, Paytm, etc.)",
            highlight: "Open any UPI app",
        },
        {
            step: 2,
            text: "Scan the QR code above or use the UPI ID manually",
            highlight: null,
        },
        {
            step: 3,
            text: "Verify the payment details and confirm",
            highlight: null,
        },
        {
            step: 4,
            text: "(MANDATORY) Email the screenshot of the payment transaction and your Reference ID to:",
            highlight: "(MANDATORY)",
            hasEmail: true,
        },
        {
            step: 5,
            text: 'Click "I Have Paid" below and enter your Transaction ID.',
            highlight: '"I Have Paid"',
        },
    ],
    BUTTON_TEXT: "I Have Paid",
    SUPPORT_TEXT_PREFIX: "Need help with payment? Contact us at ",
};
