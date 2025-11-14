// ------------------------------------------------------------
// Le-Pac – Mobile-friendly HTML5 Pac-Man recreation
// Features: Avatar upload, touch joystick + buttons, responsive
// ------------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const pausedEl = document.getElementById('paused');
const oopsEl = document.getElementById('oops');
const controlsEl = document.getElementById('mobileControls');

// Make canvas responsive
function resizeCanvas() {
    const maxW = Math.min(448, window.innerWidth * 0.9);
    const scale = maxW / 448;
    canvas.style.width = maxW + 'px';
    canvas.style.height = (496 * scale) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Show mobile controls on touch devices
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    controlsEl.classList.add('show');
}

let score = 0;
let highScore = localStorage.getItem('lePacHS') || 0;
highScoreEl.textContent = highScore;

// ---------- Maze (same as original) ----------
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,2,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,2,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,1],
  [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
  [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// ---------- Constants ----------
const TILE = 16;
const PAC_SIZE = 14;
const GHOST_SIZE = 14;
const DOT_RADIUS = 2;
const POWER_RADIUS = 5;
const SPEED = 2;
const GHOST_SPEED = 1.5;

// ---------- Game objects ----------
let pac = { x: 14*TILE, y: 23*TILE, dir: 'left', mouth: 0, alive: true };
let ghosts = [
  {x:14*TILE, y:11*TILE, color:'#f00', dir:'up',   mode:'scatter', baseColor:'#f00'},
  {x:13*TILE, y:14*TILE, color:'#ffb8ff', dir:'up', mode:'scatter', baseColor:'#ffb8ff'},
  {x:15*TILE, y:14*TILE, color:'#00ffff', dir:'up', mode:'scatter', baseColor:'#00ffff'},
  {x:14*TILE, y:14*TILE, color:'#ffb851', dir:'up', mode:'scatter', baseColor:'#ffb851'}
];
let dots = [];
let powerPellets = [];

// Build dots from maze
for (let y=0; y<maze.length; y++) {
  for (let x=0; x<maze[y].length; x++) {
    if (maze[y][x] === 0) dots.push({x:x*TILE+8, y:y*TILE+8, eaten:false});
    if (maze[y][x] === 2) powerPellets.push({x:x*TILE+8, y:y*TILE+8, eaten:false});
  }
}

// ---------- Input (Keyboard + Touch) ----------
const keys = {};
window.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
  if (e.key === ' ') { togglePause(); e.preventDefault(); }
});
window.addEventListener('keyup', e => delete keys[e.key]);

// Mobile joystick
const joystick = document.getElementById('joystick');
const knob = document.getElementById('joystickKnob');
let joystickActive = false;
let joystickAngle = 0;
let joystickDistance = 0;

joystick.addEventListener('touchstart', handleJoystick);
joystick.addEventListener('mousedown', handleJoystick);
function handleJoystick(e) {
    e.preventDefault();
    joystickActive = true;
    updateJoystick(e);
}

window.addEventListener('touchmove', e => {
    if (joystickActive) {
        e.preventDefault();
        updateJoystick(e.touches[0]);
    }
});
window.addEventListener('mousemove', e => {
    if (joystickActive) updateJoystick(e);
});

window.addEventListener('touchend', () => joystickActive = false);
window.addEventListener('mouseup', () => joystickActive = false);

function updateJoystick(e) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    joystickDistance = Math.min(20, Math.hypot(dx, dy));
    joystickAngle = Math.atan2(dy, dx);
    
    const knobX = Math.cos(joystickAngle) * joystickDistance;
    const knobY = Math.sin(joystickAngle) * joystickDistance;
    knob.style.transform = `translate(${knobX}px, ${knobY}px)`;
    
    // Map to directions
    if (joystickDistance > 10) {
        if (joystickAngle > -0.75*Math.PI && joystickAngle < -0.25*Math.PI) keys.ArrowLeft = true;
        else delete keys.ArrowLeft;
        if (joystickAngle > -0.25*Math.PI && joystickAngle < 0.25*Math.PI) keys.ArrowRight = true;
        else delete keys.ArrowRight;
        if (joystickAngle > 0.25*Math.PI && joystickAngle < 0.75*Math.PI) keys.ArrowDown = true;
        else delete keys.ArrowDown;
        if (joystickAngle > 0.75*Math.PI || joystickAngle < -0.75*Math.PI) keys.ArrowUp = true;
        else delete keys.ArrowUp;
    }
}

// D-Pad buttons
['Up','Down','Left','Right'].forEach(dir => {
    document.getElementById(`btn${dir}`).addEventListener('touchstart', e => {
        e.preventDefault();
        keys[`Arrow${dir}`] = true;
    });
    document.getElementById(`btn${dir}`).addEventListener('mousedown', e => {
        e.preventDefault();
        keys[`Arrow${dir}`] = true;
    });
    ['touchend','mouseup'].forEach(end => {
        document.getElementById(`btn${dir}`).addEventListener(end, () => {
            keys[`Arrow${dir}`] = false;
        });
    });
});

let paused = false;
function togglePause() {
  paused = !paused;
  pausedEl.classList.toggle('hidden', !paused);
}

// ---------- Main loop ----------
let last = 0;
function loop(ts) {
  if (!last) last = ts;
  const delta = ts - last;
  if (delta > 16) {
    if (!paused && pac.alive) update();
    draw();
    last = ts;
  }
  requestAnimationFrame(loop);
}

// ---------- Update (same core logic) ----------
function update() {
  let nextX = pac.x, nextY = pac.y;
  if (keys.ArrowLeft)  { nextX -= SPEED; pac.dir = 'left'; }
  if (keys.ArrowRight) { nextX += SPEED; pac.dir = 'right'; }
  if (keys.ArrowUp)    { nextY -= SPEED; pac.dir = 'up'; }
  if (keys.ArrowDown)  { nextY += SPEED; pac.dir = 'down'; }

  if (nextX < -TILE) nextX = canvas.width;
  if (nextX > canvas.width) nextX = -TILE;

  if (!wallCollision(nextX+TILE/2-PAC_SIZE/2, nextY+TILE/2-PAC_SIZE/2, PAC_SIZE)) {
    pac.x = nextX; pac.y = nextY;
  }

  // Eat dots
  dots.forEach(d => {
    if (!d.eaten && dist(pac.x+TILE/2, pac.y+TILE/2, d.x, d.y) < TILE/2) {
      d.eaten = true; score += 10; updateScore();
    }
  });
  powerPellets.forEach(p => {
    if (!p.eaten && dist(pac.x+TILE/2, pac.y+TILE/2, p.x, p.y) < TILE/2) {
      p.eaten = true; score += 50; updateScore();
      ghosts.forEach(g => g.frightened = true);
      setTimeout(() => ghosts.forEach(g => g.frightened = false), 8000);
    }
  });

  // Ghosts
  ghosts.forEach(g => {
    if (g.frightened) g.color = '#00f';
    else g.color = g.baseColor;

    const cx = Math.floor((g.x + TILE/2) / TILE);
    const cy = Math.floor((g.y + TILE/2) / TILE);
    const opts = [];
    if (cy>0 && !maze[cy-1][cx]) opts.push('up');
    if (cy<maze.length-1 && !maze[cy+1][cx]) opts.push('down');
    if (cx>0 && !maze[cy][cx-1]) opts.push('left');
    if (cx<maze[0].length-1 && !maze[cy][cx+1]) opts.push('right');

    if (opts.length > 1 && Math.random() < 0.1) {
      g.dir = opts[Math.floor(Math.random()*opts.length)];
    }

    let gx = g.x, gy = g.y;
    if (g.dir === 'left')  gx -= GHOST_SPEED;
    if (g.dir === 'right') gx += GHOST_SPEED;
    if (g.dir === 'up')    gy -= GHOST_SPEED;
    if (g.dir === 'down')  gy += GHOST_SPEED;

    if (gx < -TILE) gx = canvas.width;
    if (gx > canvas.width) gx = -TILE;

    if (!wallCollision(gx + TILE/2 - GHOST_SIZE/2, gy + TILE/2 - GHOST_SIZE/2, GHOST_SIZE)) {
      g.x = gx; g.y = gy;
    }

    if (dist(pac.x+TILE/2, pac.y+TILE/2, g.x+TILE/2, g.y+TILE/2) < TILE/2) {
      if (g.frightened) {
        score += 200; updateScore();
        g.x = 14*TILE; g.y = 14*TILE;
        g.frightened = false;
      } else {
        pac.alive = false;
        setTimeout(resetGame, 1500);
      }
    }
  });

  pac.mouth = (pac.mouth + 0.15) % (Math.PI*2);
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#00f';
  for (let y=0; y<maze.length; y++) {
    for (let x=0; x<maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
      }
    }
  }

  ctx.fillStyle = '#ffb897';
  dots.forEach(d => {
    if (!d.eaten) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI*2);
      ctx.fill();
    }
  });

  ctx.fillStyle = '#fff';
  powerPellets.forEach(p => {
    if (!p.eaten) {
      const pulse = 0.5 + 0.5*Math.sin(Date.now()/150);
      ctx.beginPath();
      ctx.arc(p.x, p.y, POWER_RADIUS*pulse, 0, Math.PI*2);
      ctx.fill();
    }
  });

  if (pac.alive) {
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    const angle = pac.mouth < Math.PI ? pac.mouth : 2*Math.PI - pac.mouth;
    const start = pac.dir === 'right' ? angle : 
                  pac.dir === 'left'  ? Math.PI - angle :
                  pac.dir === 'up'    ? 1.5*Math.PI - angle :
                                        0.5*Math.PI - angle;
    ctx.arc(pac.x + TILE/2, pac.y + TILE/2, PAC_SIZE/2, start, start + 2*Math.PI - 2*angle, false);
    ctx.lineTo(pac.x + TILE/2, pac.y + TILE/2);
    ctx.fill();
  }

  ghosts.forEach(g => {
    ctx.fillStyle = g.frightened ? '#00f' : g.color;
    ctx.beginPath();
    ctx.arc(g.x + TILE/2, g.y + TILE/2, GHOST_SIZE/2, Math.PI, 0);
    ctx.lineTo(g.x + TILE/2 + GHOST_SIZE/2, g.y + TILE/2 + GHOST_SIZE/2);
    ctx.lineTo(g.x + TILE/2 + GHOST_SIZE/6, g.y + TILE/2 + GHOST_SIZE/3);
    ctx.lineTo(g.x + TILE/2, g.y + TILE/2 + GHOST_SIZE/2);
    ctx.lineTo(g.x + TILE/2 - GHOST_SIZE/6, g.y + TILE/2 + GHOST_SIZE/3);
    ctx.lineTo(g.x + TILE/2 - GHOST_SIZE/2, g.y + TILE/2 + GHOST_SIZE/2);
    ctx.lineTo(g.x + TILE/2 - GHOST_SIZE/2, g.y + TILE/2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(g.x + TILE/2 - 4, g.y + TILE/2 - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(g.x + TILE/2 + 4, g.y + TILE/2 - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#00f';
    const px = g.dir === 'left' ? -1 : g.dir === 'right' ? 1 : 0;
    const py = g.dir === 'up' ? -1 : g.dir === 'down' ? 1 : 0;
    ctx.beginPath(); ctx.arc(g.x + TILE/2 - 4 + px, g.y + TILE/2 - 2 + py, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(g.x + TILE/2 + 4 + px, g.y + TILE/2 - 2 + py, 1, 0, Math.PI*2); ctx.fill();
  });
}

// ---------- Helpers ----------
function wallCollision(x, y, size) {
  const left   = Math.floor(x / TILE);
  const right  = Math.floor((x + size) / TILE);
  const top    = Math.floor(y / TILE);
  const bottom = Math.floor((y + size) / TILE);
  for (let cy=top; cy<=bottom; cy++) {
    for (let cx=left; cx<=right; cx++) {
      if (maze[cy] && maze[cy][cx] === 1) return true;
    }
  }
  return false;
}
function dist(x1, y1, x2, y2) { return Math.hypot(x1-x2, y1-y2); }
function updateScore() {
  scoreEl.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
    localStorage.setItem('lePacHS', highScore);
  }
}
function resetGame() {
  score = 0; updateScore();
  pac = { x: 14*TILE, y: 23*TILE, dir: 'left', mouth: 0, alive: true };
  ghosts.forEach((g,i) => {
    const starts = [[14,11],[13,14],[15,14],[14,14]];
    g.x = starts[i][0]*TILE; g.y = starts[i][1]*TILE;
    g.dir = 'up'; g.frightened = false;
  });
  dots.forEach(d=>d.eaten=false);
  powerPellets.forEach(p=>p.eaten=false);
}

// ---------- Start ----------
oopsEl.classList.add('hidden');
requestAnimationFrame(loop);

// Save avatar data URL after drawing
const avatarCanvas = document.getElementById('avatarCanvas');
avatarCanvas.getContext('2d').save = function() {
    saveAvatar(this.toDataURL());
};
