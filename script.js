let currentUserId = 1;
let typingUsers = new Set();
let typingTimeout;

let users = [
    { id: 1, name: 'Alice', status: 'online', color: 'bg-blue-500', typing: false },
    { id: 2, name: 'Bob', status: 'online', color: 'bg-green-500', typing: false },
    { id: 3, name: 'Charlie', status: 'offline', color: 'bg-purple-500', typing: false }
];

let messages = [
    { id: 1, userId: 1, text: 'Did you see the latest Tesla news?', timestamp: '10:00 AM' },
    { id: 2, userId: 2, text: 'Yes, quite interesting!', timestamp: '10:01 AM' },
    { id: 3, userId: 3, text: 'What do you think about the market impact?', timestamp: '10:02 AM' }
];

let stockNews = [
    {
        id: 1,
        title: "Tesla Announces New Battery Technology",
        snippet: "Tesla unveils revolutionary battery tech promising 500-mile range...",
        source: "Market Watch",
        timestamp: "2 hours ago",
        symbol: "TSLA",
        sentiment: "positive"
    },
    {
        id: 2,
        title: "Apple Sets New Revenue Record",
        snippet: "Apple reports record-breaking quarterly revenue driven by iPhone sales...",
        source: "Reuters",
        timestamp: "4 hours ago",
        symbol: "AAPL",
        sentiment: "positive"
    },
    {
        id: 3,
        title: "Microsoft Cloud Services Show Strong Growth",
        snippet: "Azure cloud services continue to drive Microsoft's growth...",
        source: "Bloomberg",
        timestamp: "5 hours ago",
        symbol: "MSFT",
        sentiment: "neutral"
    }
];

function getSentimentColor(sentiment) {
    switch (sentiment) {
        case 'positive': return 'text-green-500';
        case 'negative': return 'text-red-500';
        default: return 'text-gray-500';
    }
}

function switchTab(tab) {
    document.getElementById('usersContent').classList.toggle('hidden', tab !== 'users');
    document.getElementById('newsContent').classList.toggle('hidden', tab !== 'news');
    document.getElementById('usersTab').classList.toggle('tab-active', tab === 'users');
    document.getElementById('newsTab').classList.toggle('tab-active', tab === 'news');
}

function renderUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map(user => `
        <div class="flex items-center gap-2 mb-2 p-2 rounded hover:bg-gray-50 ${user.id === currentUserId ? 'bg-blue-50' : ''}">
            <div class="w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white">
                ${user.name[0]}
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <span>${user.name}</span>
                    ${user.id === currentUserId ? '<span class="text-xs text-blue-500">(you)</span
