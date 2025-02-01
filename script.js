const apiKeyCookieName = "apiKey";
const baseUrlCookieName = "baseUrl";
const modelCookieName = "model";

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

var apiKey = "zu-##########################";
var baseUrl = 'https://api.zukijourney.com/v1/chat/completions';
let messageHistory = [];
const messageContainer = document.getElementById("messageContainer");
const generatingSfx = new Audio('audio/load.mp3');
const finishSfx = new Audio('audio/finish.mp3');
const selectSfx = new Audio('audio/select.mp3');
const clickSfx = new Audio('audio/click.mp3');
const typeSfx = new Audio('audio/type.wav');
var model = 'zephyr-7b-beta';

generatingSfx.loop = true;

// Load cookies on page load
window.onload = () => {
    const savedApiKey = getCookie(apiKeyCookieName);
    const savedBaseUrl = getCookie(baseUrlCookieName);
    const savedModel = getCookie(modelCookieName);

    if (savedApiKey) apiKey = savedApiKey;
    if (savedBaseUrl) baseUrl = savedBaseUrl;
    if (savedModel) model = savedModel;

    document.getElementById("baseUrl").innerText = baseUrl;
    document.getElementById("apiKey").innerText = apiKey;
    document.getElementById("model").innerText = model;
};

var converter = new showdown.Converter();

async function send(input) {
    generatingSfx.play();
    messageHistory.push({ role: 'user', content: input });
    document.getElementById("loadingCircle").className = "visible";

    const userMessage = document.createElement('p');
    userMessage.innerHTML = input;
    userMessage.className = "yourMessage";
    userMessage.innerHTML = converter.makeHtml(userMessage.innerHTML)

    messageContainer.appendChild(userMessage);

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model, messages: messageHistory })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        // Remove the "</s>" token from the AI's message
        const aiMessage = data.choices[0].message.content.replace(/<\/s>$/, '');
        messageHistory.push({ role: 'assistant', content: aiMessage });
        typeWriterEffect(aiMessage);
        aiMessage.innerHTML = converter.makeHtml(aiMessage.innerHTML)

    } catch (error) {
        console.error('Error:', error);
    } finally {
        document.getElementById("loadingCircle").className = "";
        generatingSfx.pause();
        generatingSfx.currentTime = 0;
        finishSfx.play();
    }
}

function typeWriterEffect(text) {
    const aiMessage = document.createElement('p');
    aiMessage.className = "aiMessage";
    aiMessage.innerHTML = '';
    messageContainer.appendChild(aiMessage);
    
    let index = 0;

    const type = () => {
        if (index < text.length) {
            aiMessage.innerHTML += text.charAt(index++);
            if (index % 12 === 1) {
                setTimeout(type, 10);
                if (index % 32 === 1) {
                    typeSfx.currentTime = 0; // Reset sound to start
                    typeSfx.play();
                }
            } else {
                type();
            }
        }
    };

    type();
}


document.addEventListener('DOMContentLoaded', () => {
    const cursor2 = document.getElementById('cursorAlt');
    
    document.addEventListener('mousemove', (event) => {
        cursor2.style.left = (event.clientX) + 'px'; // Center the dot
        cursor2.style.top = (event.clientY) + 'px'; // Center the dot
    });
    
    const cursor = document.getElementById('cursor');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    const speed = 0.1;

    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX - 13;
        targetY = event.clientY - 3;
    });

    const animate = () => {
        const rect = cursor.getBoundingClientRect();
        var l = rect.left + (targetX - rect.left) * speed
        cursor.style.left = l + 'px';
        cursor.style.top = rect.top + (targetY - rect.top) * speed + 'px';
        requestAnimationFrame(animate);
        cursor.style.rotate = (targetX - l) * 0.1 + "deg"
    };

    animate();
});

const playSound = (sound) => {
    sound.currentTime = 0; // Reset sound to start
    sound.play();
};

const setupButtonClick = (buttonId, callback) => {
    document.getElementById(buttonId).addEventListener('click', callback);
};

setupButtonClick("sendButton", () => {
    if (apiKey === "zu-##########################") {
        document.getElementById("textarea").value = "Set an API key in settings first.";
        return;
    }
    const value = document.getElementById("textarea").value;
    document.getElementById("textarea").value = '';
    send(value);
    playSound(clickSfx);
});

setupButtonClick("updateSettings", () => {
    baseUrl = document.getElementById("baseUrl").value;
    apiKey = document.getElementById("apiKey").value;
    model = document.getElementById("model").value;

    // Save settings in cookies
    setCookie(apiKeyCookieName, apiKey, 3650);
    setCookie(baseUrlCookieName, baseUrl, 3650);
    setCookie(modelCookieName, model, 3650);

    playSound(clickSfx);
});

setupButtonClick("closeSettings", () => {
    document.getElementById("settingsBg").className = "";
    playSound(clickSfx);
});

setupButtonClick("closeSettingsAlt", () => {
    window.location.href = `index.html`;
    playSound(clickSfx);
});

setupButtonClick("settings", () => {
    document.getElementById("settingsBg").className = "visible";
    playSound(clickSfx);
});

const setupMouseOver = (buttonId) => {
    document.getElementById(buttonId).addEventListener('mouseover', () => playSound(selectSfx));
};

["updateSettings", "settings", "sendButton", "closeSettings", "closeSettingsAlt"].forEach(setupMouseOver);

document.addEventListener('keydown', () => playSound(typeSfx));

const params = new URLSearchParams(window.location.search);
const charName = params.get('char'); // Gets the value of the "name" parameter
let desc = params.get('desc'); // Gets the value of the "name" parameter
const userName = params.get('user'); // Gets the value of the "name" parameter
const pers = params.get('pers'); // Gets the value of the "name" parameter

if (charName) {
    document.getElementById("title").innerHTML = charName;
}


if (desc) {
    desc = "{{char}}'s Description"
    desc = desc.replace("{{char}}", charName);
    desc = desc.replace("{{user}}", userName);
    
    messageHistory.push({ role: 'system', content: desc });
}
if (pers) {
    desc = "{{user}}'s Description"
    desc = desc.replace("{{char}}", charName);
    desc = desc.replace("{{user}}", userName);
    
    messageHistory.push({ role: 'system', content: desc });
    messageHistory.push({ role: 'system', content: "You are " + charName + ", and the user is " + userName });
}



if (params.get('settingsOpen')) {
    document.getElementById("settingsBg").className = "visible";
    document.getElementById("closeSettings").className = "";
    document.getElementById("closeSettingsAlt").className = "visible";
}