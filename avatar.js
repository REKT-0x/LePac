// Avatar upload functionality
const avatarInput = document.getElementById('avatarInput');
const avatarCanvas = document.getElementById('avatarCanvas');

// Click avatar to upload
avatarCanvas.addEventListener('click', () => avatarInput.click());
avatarInput.addEventListener('change', loadAvatar);

function loadAvatar(e) {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            const ctx = avatarCanvas.getContext('2d');
            ctx.clearRect(0,0,48,48);
            
            // Draw circular avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(24,24,22,0,Math.PI*2);
            ctx.clip();
            ctx.drawImage(img, 0,0,48,48);
            ctx.restore();
            
            // Add yellow glow effect
            ctx.shadowColor = '#ff0';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(24,24,22,0,Math.PI*2);
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };
        img.src = URL.createObjectURL(file);
    }
}

// Load saved avatar on start (if exists)
const savedAvatar = localStorage.getItem('lePacAvatar');
if (savedAvatar) {
    const img = new Image();
    img.onload = () => {
        const ctx = avatarCanvas.getContext('2d');
        ctx.drawImage(img, 0,0,48,48);
    };
    img.src = savedAvatar;
}

// Save avatar to localStorage when changed
function saveAvatar(dataUrl) {
    localStorage.setItem('lePacAvatar', dataUrl);
}
