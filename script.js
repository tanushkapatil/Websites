const ws = new WebSocket('wss://echo.websocket.events');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const usersList = document.getElementById('users-list');
const sendBtn = document.getElementById('sendBtn');
const undoBtn = document.getElementById('undoBtn');
const resendBtn = document.getElementById('resendBtn');

let users = [
    { id: 1, name: 'Akash', messages: [] },
    { id: 2, name: 'Bhuvan', messages: [] },
    { id: 3, name: 'Chayya', messages: [] },
    { id: 4, name: 'Diya', messages: [] },
    { id: 5, name: 'Eve', messages: [] },
    { id: 6, name: 'Falak', messages: [] },
    { id: 7, name: 'Gaurav', messages: [] },
    { id: 8, name: 'Hardik', messages: [] },
    { id: 9, name: 'Ishita', messages: [] }
];

let activeUserId = null;

// Stack to hold sent messages
let messageStack = [];
let unsentMessages = []; // Array to hold all unsent messages

// On WebSocket connection
ws.onopen = () => {
    console.log('Connected to the WebSocket server');
    renderUsersList();
};

// Handle receiving messages
ws.onmessage = (event) => {
    const message = event.data;
    if (activeUserId !== null) {
        const user = users.find(u => u.id === activeUserId);
        user.messages.push({ content: message, type: 'received' });
        displayMessages(user);
    }
};

// Send a message (Push to stack)
function sendMessage() {
    const message = messageInput.value;
    if (message && activeUserId !== null) {
        const user = users.find(u => u.id === activeUserId);
        user.messages.push({ content: message, type: 'sent' });
        messageStack.push(message);  // Add message to the stack
        messageInput.value = '';     // Clear input box
        displayMessages(user);       // Update chat display
        moveUserToTop(activeUserId);
        ws.send(message);            // Send message to server
        unsentMessages = [];         // Clear unsent messages as message was sent successfully
        updateButtons();             // Update button states
    }
}

// Undo the last message (Pop from stack)
undoBtn.addEventListener('click', () => {
    if (messageStack.length > 0) {
        const lastMessage = messageStack.pop();  // Store the last message for resending
        unsentMessages.push(lastMessage);  // Add to unsent messages array
        const user = users.find(u => u.id === activeUserId);
        user.messages.pop(); // Remove the last message from displayed messages
        displayMessages(user); // Update chat display
        updateButtons(); // Update button states
    }
});

// Resend one unsent message at a time
resendBtn.addEventListener('click', () => {
    if (unsentMessages.length > 0) {
        const messageToResend = unsentMessages.pop(); // Remove one message from the unsent array
        messageStack.push(messageToResend); // Push the message back to the stack
        const user = users.find(u => u.id === activeUserId);
        user.messages.push({ content: messageToResend, type: 'sent' });
        displayMessages(user); // Update chat display
        ws.send(messageToResend); // Resend the message
        updateButtons(); // Update button states
    }
});

// Function to display messages in the chat box
function displayMessages(user) {
    chatBox.innerHTML = '';  // Clear the chat box
    user.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.type);  // Add message class
        messageDiv.textContent = message.content; // Set the message text
        chatBox.appendChild(messageDiv); // Append the message to chat box
    });

    // Automatically scroll to the bottom when a message is added
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Render the list of online users
function renderUsersList() {
    usersList.innerHTML = ''; // Clear the user list
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = user.name;
        userItem.onclick = () => selectUser(user.id); // Set click event for user selection
        if (user.id === activeUserId) userItem.classList.add('active'); // Highlight active user
        usersList.appendChild(userItem); // Append user to list
    });
}

// Select a user to chat with
function selectUser(userId) {
    activeUserId = userId; // Set the active user ID
    const user = users.find(u => u.id === userId);
    displayMessages(user); // Display messages for the selected user
    renderUsersList(); // Render the updated user list
    updateButtons(); // Update button states when selecting a user
}

// Move the selected user to the top of the list
function moveUserToTop(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const [user] = users.splice(userIndex, 1);
        users.unshift(user); // Move user to the top
        renderUsersList(); // Re-render user list
    }
}

// Function to update button states
function updateButtons() {
    undoBtn.disabled = messageStack.length === 0; // Enable or disable undo button
    resendBtn.disabled = unsentMessages.length === 0; // Enable or disable resend button
}
