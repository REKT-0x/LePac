const avatarInput = document.getElementById('avatarInput');
const avatarCanvas = document.getElementById('avatarCanvas');
const ctxAvatar = avatarCanvas.getContext('2d');

// Click avatar to upload
avatarCanvas.addEventListener('click', () => avatarInput.click());
avatarInput.addEventListener('change', loadAvatar);

function loadAvatar(e) {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            ctxAvatar.clearRect(0, 0, 48, 48);
            ctxAvatar.save();
            ctxAvatar.beginPath();
            ctxAvatar.arc(24, 24, 22, 0, Math.PI * 2);
            ctxAvatar.clip();
            ctxAvatar.drawImage(img, 0, 0, 48, 48);
            ctxAvatar.restore();
            saveAvatar(avatarCanvas.toDataURL());
        };
        img.src = URL.createObjectURL(file);
    }
}

function saveAvatar(dataUrl) {
    localStorage.setItem('lePacAvatar', dataUrl);
}

// Load saved avatar
const saved = localStorage.getItem('lePacAvatar');
if (saved) {
    const img = new Image();
    img.onload = () => ctxAvatar.drawImage(img, 0, 0, 48, 48);
    img.src = saved;
} else {
    // Default Pac-Man face
    ctxAvatar.fillStyle = '#ff0';
    ctxAvatar.beginPath();
    ctxAvatar.arc(24, 24, 22, 0, Math.PI * 2);
    ctxAvatar.fill();
    ctxAvatar.fillStyle = '#000';
    ctxAvatar.beginPath();
    ctxAvatar.arc(24, 24, 22, 0.2, Math.PI * 1.8);
    ctxAvatar.lineTo(24, 24);
    ctxAvatar.fill();
    saveAvatar(avatarCanvas.toDataURL());
}
