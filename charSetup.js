document.getElementById('characterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const charName = encodeURIComponent(document.getElementById('charName').value);
    const desc = encodeURIComponent(document.getElementById('desc').value);
    const userName = encodeURIComponent(document.getElementById('userName').value);
    const userDesc = encodeURIComponent(document.getElementById('userDesc').value);

    // Redirect to ai.html with parameters
    window.location.href = `ai.html?char=${charName}&desc=${desc}&user=${userName}&pers=${userDesc}`;
});

document.getElementById('settingsOpen').addEventListener('click', function(event) {
    // Redirect to ai.html with parameters
    window.location.href = `ai.html?settingsOpen=true`;
});

// Function to download character information
function downloadCharacterInfo() {
    const charName = document.getElementById('charName').value;
    const desc = document.getElementById('desc').value;
    
    const characterData = `Character Name: ${charName}\nDescription: ${desc}`;
    const blob = new Blob([characterData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character_info.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to download user information
function downloadUserInfo() {
    const userName = document.getElementById('userName').value;
    const userDesc = document.getElementById('userDesc').value;
    
    const userData = `User Name: ${userName}\nDescription: ${userDesc}`;
    const blob = new Blob([userData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_info.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to handle character file upload
document.getElementById('uploadCharacterBtn').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result.split('\n');
            document.getElementById('charName').value = content[0].replace('Character Name: ', '');
            document.getElementById('desc').value = content[1].replace('Description: ', '');
        };
        reader.readAsText(file);
    }
});

// Function to handle user file upload
document.getElementById('uploadUserBtn').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result.split('\n');
            document.getElementById('userName').value = content[0].replace('User Name: ', '');
            document.getElementById('userDesc').value = content[1].replace('Description: ', '');
        };
        reader.readAsText(file);
    }
});

// Adding event listeners for download buttons
document.getElementById('downloadCharacterBtn').addEventListener('click', downloadCharacterInfo);
document.getElementById('downloadUserBtn').addEventListener('click', downloadUserInfo);

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
        targetX = event.clientX;
        targetY = event.clientY;
    });

    const animate = () => {
        const rect = cursor.getBoundingClientRect();
        var l = rect.left + (targetX - rect.left) * speed
        cursor.style.left = l + 'px';
        cursor.style.top = rect.top + (targetY - rect.top) * speed + 'px';
        requestAnimationFrame(animate);
        cursor.style.rotate = (targetX - l) * 0.05 + "deg"
    };

    animate();
});