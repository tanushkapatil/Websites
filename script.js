// Stack to hold sent messages
let messageStack = [];
let unsentMessages = []; // Array to hold all unsent messages

// DOM elements
const messageInput = document.getElementById('messageInput');
const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const undoBtn = document.getElementById('undoBtn');
const resendBtn = document.getElementById('resendBtn');

// Send a message (Push to stack)
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        messageStack.push(message);  // Add message to the stack
        messageInput.value = '';     // Clear input box
        displayMessages();           // Update chat display
        resendBtn.style.display = unsentMessages.length > 0 ? 'block' : 'none'; // Hide/show resend button based on unsent messages
    }
});

// Undo the last message (Pop from stack)
undoBtn.addEventListener('click', () => {
    if (messageStack.length > 0) {
        const lastMessage = messageStack.pop();  // Store the last message for resending
        unsentMessages.push(lastMessage);  // Add to unsent messages array
        displayMessages();   // Update chat display
        resendBtn.style.display = 'block'; // Show resend button
    }
});
