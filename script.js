// User and message management
let currentUser = null;
let users = [];
let messages = [];
let stockNews = [];

// Socket connection (placeholder for future WebSocket implementation)
let socket = null;

// Initialize the application
function initApp() {
    // UI Event Listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('messageInput').addEventListener('input', handleTyping);
    document.getElementById('messageForm').addEventListener('submit', sendMessage);

    // Initialize UI components
    renderUsers();
    renderNews();
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (username) {
        currentUser = {
            id: Date.now(),
            name: username,
            status: 'online',
            color: getRandomUserColor()
        };

        // Hide login modal
        document.getElementById('loginModal').classList.add('hidden');
        
        // Show chat interface
        document.getElementById('chatInterface').classList.remove('hidden');

        // Broadcast user join (in a real app, this would be a socket event)
        broadcastUserJoin(currentUser);

        usernameInput.value = '';
    }
}

// Generate random user color
function getRandomUserColor() {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Typing Indicator
function handleTyping(event) {
    const messageInput = event.target;
    const isTyping = messageInput.value.length > 0;

    // In a real app, this would be a socket event
    broadcastTypingStatus(isTyping);
}

// Send Message
function sendMessage(event) {
    event.preventDefault();
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText && currentUser) {
        const newMessage = {
            id: Date.now(),
            userId: currentUser.id,
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // In a real app, this would be a socket event
        broadcastMessage(newMessage);

        messageInput.value = '';
        broadcastTypingStatus(false);
    }
}

// Broadcast methods (simulating socket events)
function broadcastUserJoin(user) {
    users.push(user);
    renderUsers();
}

function broadcastMessage(message) {
    messages.push(message);
    renderMessages();
}

function broadcastTypingStatus(isTyping) {
    // Update current user's typing status
    if (currentUser) {
        currentUser.typing = isTyping;
        renderTypingIndicators();
    }
}

// Render Methods
function renderUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map(user => `
        <div class="flex items-center gap-2 mb-2 p-2 rounded hover:bg-gray-50 ${user.id === currentUser?.id ? 'bg-blue-50' : ''}">
            <div class="w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white">
                ${user.name[0]}
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <span>${user.name}</span>
                    ${user.id === currentUser?.id ? '<span class="text-xs text-blue-500">(you)</span>' : ''}
                    ${user.typing ? '<span class="text-xs text-gray-500">typing...</span>' : ''}
                </div>
                <div class="text-xs text-gray-400">${user.status}</div>
            </div>
        </div>
    `).join('');
}

function renderMessages() {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = messages.map(message => {
        const user = users.find(u => u.id === message.userId);
        return `
        <div class="flex items-start gap-2 mb-4 ${message.userId === currentUser?.id ? 'flex-row-reverse' : ''}">
            <div class="w-8 h-8 rounded-full ${user?.color} flex items-center justify-center text-white">
                ${user?.name[0]}
            </div>
            <div class="flex-1">
                <div class="bg-gray-100 p-2 rounded-lg ${message.userId === currentUser?.id ? 'bg-blue-100 text-right' : ''}">
                    <p>${message.text}</p>
                    <span class="text-xs text-gray-500">${message.timestamp}</span>
                </div>
            </div>
        </div>
    `}).join('');
    
    // Scroll to bottom
    messageList.scrollTop = messageList.scrollHeight;
}

function renderTypingIndicators() {
    const typingIndicators = document.getElementById('typingIndicators');
    const typingUsers = users.filter(user => user.typing && user.id !== currentUser?.id);
    
    if (typingUsers.length > 0) {
        const userNames = typingUsers.map(user => user.name);
        typingIndicators.innerHTML = `
            <div class="typing-indicator">
                ${userNames.join(', ')} ${userNames.length === 1 ? 'is' : 'are'} typing
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
    } else {
        typingIndicators.innerHTML = '';
    }
}

function renderNews() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = stockNews.map(news => `
        <div class="mb-4 p-3 rounded-lg hover:bg-gray-50 border">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold">${news.title}</h3>
                <span class="text-xs ${getSentimentColor(news.sentiment)}">${news.sentiment}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">${news.snippet}</p>
            <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>${news.source}</span>
                <span>${news.timestamp}</span>
                <span class="font-medium">${news.symbol}</span>
            </div>
        </div>
    `).join('');
}

function getSentimentColor(sentiment) {
    switch (sentiment) {
        case 'positive': return 'text-green-500';
        case 'negative': return 'text-red-500';
        default: return 'text-gray-500';
    }
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
