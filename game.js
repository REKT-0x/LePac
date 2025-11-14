const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const pausedEl = document.getElementById('paused');
const oopsEl = document.getElementById('oops');
const controlsEl = document.getElementById('mobileControls');
const avatarCanvas = document.getElementById('avatarCanvas');

// Responsive canvas
function resizeCanvas() {
    const maxW = Math.min(448, window.innerWidth * 0.9);
    const scale = maxW / 448;
    canvas.style.width = maxW + 'px';
    canvas.style.height = (496 * scale) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Show controls on mobile
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    controlsEl.classList.add('show');
}

// Score
let score = 0;
let highScore = localStorage.getItem('lePacHS') || 0;
highScoreEl.textContent = highScore;

// Maze
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

const TILE = 16;
const PAC_SIZE = 14;
const GHOST_SIZE = 14;
const DOT_RADIUS = 2;
const POWER_RADIUS = 5;
const SPEED = 2;
const GHOST_SPEED = 1.5;

let pac = { x: 14*TILE, y: 23*TILE, dir: 'left', mouth: 0, alive: true };
let ghosts = [
  {x:14*TILE, y:11*TILE, color:'#f00', dir:'up',   mode:'scatter', baseColor:'#f00'},
  {x:13*TILE, y:14*TILE, color:'#ffb8ff', dir:'up', mode:'scatter', baseColor:'#ffb8ff'},
  {x:15*TILE, y:14*TILE, color:'#00ffff', dir:'up', mode:'scatter', baseColor:'#00ffff'},
  {x:14*TILE, y:14*TILE, color:'#ffb851', dir:'up', mode:'scatter', baseColor:'#ffb851'}
];
let dots = [];
let powerPellets = [];

for (let y=0; y<maze.length; y++) {
  for (let x=0; x<maze[y].length; x++) {
    if (maze[y][x] === 0) dots.push({x:x*TILE+8, y:y*TILE+8, eaten:false});
    if (maze[y][x] === 2) powerPellets.push({x:x*TILE+8, y:y*TILE+8, eaten:false});
  }
}

// Input
const keys = {};
window.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
  if (e.key === ' ') { togglePause(); e.preventDefault(); }
});
window.addEventListener('keyup', e => delete keys[e.key]);

// Joystick
const joystick = document.getElementById('joystick');
const knob = document.getElementById('joystickKnob');
let joystickActive = false;
let joystickAngle = 0;
let joystickDistance = 0;

joystick.addEventListener('touchstart', e => { e.preventDefault(); joystickActive = true; updateJoystick(e); });
joystick.addEventListener('mousedown', e => { e.preventDefault(); joystickActive = true; updateJoystick(e); });

window.addEventListener('touchmove', e => { if (joystickActive) { e.preventDefault(); updateJoystick(e.touches[0]); } });
window.addEventListener('mousemove', e => { if (joystickActive) updateJoystick(e); });
window.addEventListener('touchend', () => joystickActive = false);
window.addEventListener('mouseup', () => joystickActive = false);

function updateJoystick(e) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX || e.touches[0].clientX) - centerX;
    const dy = (e.clientY || e.touches[0].clientY) - centerY;
    joystickDistance = Math.min(20, Math.hypot(dx, dy));
    joystickAngle = Math.atan2(dy, dx);
    const knobX = Math.cos(joystickAngle) * joystickDistance;
    const knobY = Math.sin(joystickAngle) * joystickDistance;
    knob.style.transform = `translate(${knobX}px, ${knobY}px)`;

    if (joystickDistance > 10) {
        keys.ArrowLeft = joystickAngle > -0.75*Math.PI && joystickAngle < -0.25*Math.PI;
        keys.ArrowRight = joystickAngle > -0.25*Math.PI && joystickAngle < 0.25*Math.PI;
        keys.ArrowDown = joystickAngle > 0.25*Math.PI && joystickAngle < 0.75*Math.PI;
        keys.ArrowUp = joystickAngle > 0.75*Math.PI || joystickAngle < -0.75*Math.PI;
    } else {
        delete keys.ArrowLeft; delete keys.ArrowRight; delete keys.ArrowDown; delete keys.ArrowUp;
    }
}

// D-pad
['Up','Down','Left','Right'].forEach(dir => {
    const btn = document.getElementById(`btn${dir}`);
    btn.addEventListener('touchstart', e => { e.preventDefault(); keys[`Arrow${dir}`] = true; });
    btn.addEventListener('mousedown', e => { e.preventDefault(); keys[`Arrow${dir}`] = true; });
    ['touchend','mouseup'].forEach(ev => btn.addEventListener(ev, () => keys[`Arrow${dir}`] = false));
});

let paused = false;
function togglePause() {
  paused = !paused;
  pausedEl.classList.toggle('hidden', !paused);
}

// Canvas touch fix
canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// Main loop
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

  ghosts.forEach(g => {
    if (g.frightened) g.color = '#00f'; else g.color = g.baseColor;

    const cx = Math.floor((g.x + TILE/2) / TILE);
    const cy = Math.floor((g.y + TILE/2) / TILE);
    const opts = [];
    if (cy>0 && !maze[cy-1][cx]) opts.push('up');
    if (cy<maze.length-1 && !maze[cy+1][cx]) opts.push('down');
    if (cx>0 && !maze[cy][cx-1]) opts.push('left');
    if (cx<maze[0].length-1 && !maze[cy][cx+1]) opts.push('right');

    if (opts.length > 1 && Math.random() < 0.1) g.dir = opts[Math.floor(Math.random()*opts.length)];

    let gx = g.x, gy = g.y;
    if (g.dir === 'left') gx -= GHOST_SPEED;
    if (g.dir === 'right') gx += GHOST_SPEED;
    if (g.dir === 'up') gy -= GHOST_SPEED;
    if (g.dir === 'down') gy += GHOST_SPEED;

    if (gx < -TILE) gx = canvas.width;
    if (gx > canvas.width) gx = -TILE;

    if (!wallCollision(gx + TILE/2 - GHOST_SIZE/2, gy + TILE/2 - GHOST_SIZE/2, GHOST_SIZE)) {
      g.x = gx; g.y = gy;
    }

    if (dist(pac.x+TILE/2, pac.y+TILE/2, g.x+TILE/2, g.y+TILE/2) < TILE/2) {
      if (g.frightened) {
        score += 200; updateScore();
        g.x = 14*TILE; g.y = 14*TILE; g.frightened = false;
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
      if (maze[y][x] === 1) ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
    }
  }

  ctx.fillStyle = '#ffb897';
  dots.forEach(d => { if (!d.eaten) { ctx.beginPath(); ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI*2); ctx.fill(); } });

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
    const centerX = pac.x + TILE/2;
    const centerY = pac.y + TILE/2;
    const radius = PAC_SIZE / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarCanvas, centerX - radius, centerY - radius, PAC_SIZE, PAC_SIZE);
    ctx.restore();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const angle = pac.mouth < Math.PI ? pac.mouth : 2*Math.PI - pac.mouth;
    const start = pac.dir === 'right' ? angle : 
                  pac.dir === 'left'  ? Math.PI - angle :
                  pac.dir === 'up'    ? 1.5*Math.PI - angle :
                                        0.5*Math.PI - angle;
    ctx.arc(centerX, centerY, radius, start, start + 2*Math.PI - 2*angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ff0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ghosts.forEach(g => {
    const gx = g.x + TILE/2;
    const gy = g.y + TILE/2;
    ctx.fillStyle = g.frightened ? '#00f' : g.color;
    ctx.beginPath();
    ctx.arc(gx, gy, GHOST_SIZE/2, Math.PI, 0);
    ctx.lineTo(gx + GHOST_SIZE/2, gy + GHOST_SIZE/2);
    ctx.lineTo(gx + GHOST_SIZE/6, gy + GHOST_SIZE/3);
    ctx.lineTo(gx, gy + GHOST_SIZE/2);
    ctx.lineTo(gx - GHOST_SIZE/6, gy + GHOST_SIZE/3);
    ctx.lineTo(gx - GHOST_SIZE/2, gy + GHOST_SIZE/2);
    ctx.lineTo(gx - GHOST_SIZE/2, gy);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(gx - 4, gy - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(gx + 4, gy - 2, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#00f';
    const px = g.dir === 'left' ? -1 : g.dir === 'right' ? 1 : 0;
    const py = g.dir === 'up' ? -1 : g.dir === 'down' ? 1 : 0;
    ctx.beginPath(); ctx.arc(gx - 4 + px, gy - 2 + py, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(gx + 4 + px, gy - 2 + py, 1, 0, Math.PI*2); ctx.fill();
  });
}

function wallCollision(x, y, size) {
  const left = Math.floor(x / TILE);
  const right = Math.floor((x + size) / TILE);
  const top = Math.floor(y / TILE);
  const bottom = Math.floor((y + size) / TILE);
  for (let cy=top; cy<=bottom; cy++) {
    for (let cx=left; cx<=right; cx++) {
      if (maze[cy] && maze[cy][cx] === 1) return true;
    }
  }
  return false;
}
function dist(x1,y1,x2,y2) { return Math.hypot(x1-x2, y1-y2); }
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

oopsEl.classList.add('hidden');
requestAnimationFrame(loop);
