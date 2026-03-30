// SHAPE DEFINITIONS
// ─────────────────────────────────────────────────
const SHAPES_DEF = [
    { id: 'NODE_01', w: 43, h: 173, color: '#ff00aa', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Deep Pink
    { id: 'VECTOR_B', w: 230, h: 29, color: '#ff007f', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-right' },
    { id: 'ID_9928', w: 86, h: 86, color: '#ffff00', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-left' },
    { id: 'STRUC_04', w: 24, h: 115, color: '#32cd32', filled: true, label: 'name / 0000-00-00', labelPos: 'top-right' },
    { id: 'LATENCY_CORE', w: 288, h: 58, color: '#ff00ff', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Magenta
    { id: 'NODE_06', w: 58, h: 43, color: '#ff0000', filled: false, label: 'name / 0000-00-00', labelPos: 'bottom-left' }, // Neon Red
    { id: 'UPTIME_REF', w: 24, h: 230, color: '#ff5e00', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-right' }, // Neon Orange
    { id: 'MAPPING_X', w: 72, h: 144, color: '#bfff00', filled: true, label: 'name / 0000-00-00', labelPos: 'top-right' }, // Neon Chartreuse
    { id: 'SYNC_PULSE', w: 144, h: 24, color: '#00ff00', filled: false, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Green
    { id: 'BOUND_BOX_10', w: 115, h: 115, color: '#00ff9d', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Spring Green
    { id: 'NODE_11', w: 43, h: 43, color: '#00bfff', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-left' }, // Neon Deep Sky Blue
    { id: 'STREAM_END', w: 202, h: 24, color: '#0000ff', filled: false, label: 'name / 0000-00-00', labelPos: 'top-right' }, // Neon Blue
    { id: 'COORD_13', w: 24, h: 86, color: '#7f00ff', filled: true, label: 'name / 0000-00-00', labelPos: 'top-right' }, // Neon Violet
    { id: 'ENTITY_DENSITY', w: 50, h: 202, color: '#00ffff', filled: true, label: 'KF being : 2026-03-31', labelPos: 'bottom-left' }, // Cyan!  ← AGENT
    { id: 'BIT_RATE', w: 72, h: 72, color: '#ffea00', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-right' }, // Neon Goldenrod 
    { id: 'REF_VAL', w: 115, h: 43, color: '#9d00ff', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-left' }, // Neon Purple
    { id: 'LINKAGE_PRIME', w: 115, h: 24, color: '#ff0055', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Crimson
    { id: 'NODE_18', w: 86, h: 29, color: '#00ffcc', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-right' }, // Neon Teal
    { id: 'STRUC_19', w: 36, h: 144, color: '#ff9900', filled: true, label: 'name / 0000-00-00', labelPos: 'top-right' }, // Bright Orange
    { id: 'BOX_20', w: 120, h: 120, color: '#ccff00', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Neon Yellow-Green
    { id: 'LINK_21', w: 24, h: 108, color: '#ff00cc', filled: false, label: 'name / 0000-00-00', labelPos: 'bottom-left' }, // Hot Magenta
    { id: 'PULSE_22', w: 168, h: 24, color: '#00ccff', filled: true, label: 'name / 0000-00-00', labelPos: 'top-right' }, // Neon Sky Blue
    { id: 'NODE_23', w: 60, h: 60, color: '#9900ff', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-right' }, // Deep Purple
    { id: 'STREAM_24', w: 180, h: 24, color: '#ff3333', filled: true, label: 'name / 0000-00-00', labelPos: 'top-left' }, // Light Neon Red
    { id: 'REF_25', w: 24, h: 72, color: '#33ff99', filled: true, label: 'name / 0000-00-00', labelPos: 'bottom-left' } // Mint Green
];

// ─────────────────────────────────────────────────
// PHYSICS STATE
// ─────────────────────────────────────────────────
const MARGIN = 80;  // stay away from header/footer
const SPEED = 0.6; // base px/frame
const objects = [];
let frozen = false;
let rafId = null;

function randBetween(a, b) { return a + Math.random() * (b - a); }

function initObjects() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const agentDef = SHAPES_DEF.find(d => d.id === 'ENTITY_DENSITY');
    const otherDefs = SHAPES_DEF.filter(d => d.id !== 'ENTITY_DENSITY');

    // 1. Add the KFbeing agent (ENTITY_DENSITY)
    if (agentDef) {
        addObject(agentDef, W, H);
    }

    // 2. Add 48 other decorative shapes
    for (let i = 0; i < 48; i++) {
        // Cycle through templates or pick randomly
        const template = otherDefs[i % otherDefs.length];
        addObject(template, W, H);
    }
}

/**
 * Helper to create a shape object with physics and random positioning
 */
function addObject(def, W, H) {
    // Random starting position avoiding edges
    let x, y, tries = 0;
    do {
        x = randBetween(20, W - def.w - 20);
        y = randBetween(MARGIN, H - def.h - MARGIN);
        tries++;
    } while (tries < 50 && objects.some(o => rectsOverlap(x, y, def.w, def.h, o.x, o.y, o.w, o.h, 8)));

    // Random angle and speed
    const angle = Math.random() * 2 * Math.PI;
    const speed = SPEED * randBetween(0.6, 1.4);

    objects.push({
        ...def,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        el: null,
        // scale tracked for collision box if pulsing
        scale: 1,
    });
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh, pad = 0) {
    return ax < bx + bw + pad &&
        ax + aw + pad > bx &&
        ay < by + bh + pad &&
        ay + ah + pad > by;
}

// ─────────────────────────────────────────────────
// DOM BUILD
// ─────────────────────────────────────────────────
function buildDOM() {
    const container = document.getElementById('viz-container');

    objects.forEach(obj => {
        const div = document.createElement('div');
        const isAgent = obj.id === 'ENTITY_DENSITY';
        div.className = 'shape' + (isAgent ? ' filled' : '');
        div.style.width = obj.w + 'px';
        div.style.height = obj.h + 'px';
        div.style.left = obj.x + 'px';
        div.style.top = obj.y + 'px';

        if (isAgent) {
            div.style.backgroundColor = obj.color;
        } else {
            const styles = ['outline', 'stripe', 'dot', 'crosshatch'];
            const style = styles[Math.floor(Math.random() * styles.length)];

            div.style.backgroundColor = 'transparent';

            if (style === 'outline') {
                div.style.border = `1px solid ${obj.color}`;
            } else if (style === 'stripe') {
                div.style.border = 'none';
                const gap = Math.floor(Math.random() * 7) + 2; // 2px ~ 8px
                div.style.background = `repeating-linear-gradient(-45deg, transparent, transparent ${gap}px, ${obj.color} ${gap}px, ${obj.color} ${gap + 1}px)`;
            } else if (style === 'dot') {
                div.style.border = 'none';
                const dotSize = Math.floor(Math.random() * 2) + 1; // 1px ~ 2px
                const dotSpace = Math.floor(Math.random() * 7) + 5; // 5px ~ 11px
                div.style.backgroundImage = `radial-gradient(circle, ${obj.color} ${dotSize}px, transparent ${dotSize}px)`;
                div.style.backgroundSize = `${dotSpace}px ${dotSpace}px`;
            } else if (style === 'crosshatch') {
                div.style.border = 'none';
                const gap = Math.floor(Math.random() * 8) + 8; // 8px ~ 15px
                div.style.background = `
                    repeating-linear-gradient(45deg, transparent, transparent ${gap}px, ${obj.color} ${gap}px, ${obj.color} ${gap + 1}px),
                    repeating-linear-gradient(-45deg, transparent, transparent ${gap}px, ${obj.color} ${gap}px, ${obj.color} ${gap + 1}px)
                `;
            }
        }

        // Label
        const span = document.createElement('span');
        span.className = 'label-text';
        span.textContent = obj.label;
        span.style.position = 'absolute';

        switch (obj.labelPos) {
            case 'top-left':
                span.style.top = '-18px'; span.style.left = '0'; break;
            case 'top-right':
                span.style.top = '-18px'; span.style.right = '0'; break;
            case 'bottom-left':
                span.style.bottom = '-18px'; span.style.left = '0'; break;
            case 'bottom-right':
                span.style.bottom = '-18px'; span.style.right = '0'; break;
            case 'left-rotated':
                span.style.top = '0'; span.style.left = '-8px';
                span.style.transformOrigin = 'top right';
                span.style.transform = 'rotate(-90deg) translateX(-100%)';
                break;
        }
        div.appendChild(span);

        // Pulse animation ONLY for the agent shape (KF being)
        if (isAgent) {
            div.style.animationDuration = randBetween(2.5, 5.5) + 's'; // random pulse speed (slower)
        }

        // Hover events ONLY for KF being
        if (obj.id === 'ENTITY_DENSITY') {
            div.style.cursor = 'pointer';
            div.addEventListener('mouseenter', onFilledHover);
            div.addEventListener('mouseleave', onFilledLeave);
            div.addEventListener('click', () => openModal(obj));
        }

        container.appendChild(div);
        obj.el = div;
    });
}

// ─────────────────────────────────────────────────
// ANIMATION LOOP
// ─────────────────────────────────────────────────
function tick() {
    if (!frozen) {
        const W = window.innerWidth;
        const H = window.innerHeight;

        // Move each object
        objects.forEach(obj => {
            obj.x += obj.vx;
            obj.y += obj.vy;

            // Wall bounce
            if (obj.x < 0) { obj.x = 0; obj.vx = Math.abs(obj.vx); }
            if (obj.x + obj.w > W) { obj.x = W - obj.w; obj.vx = -Math.abs(obj.vx); }
            if (obj.y < MARGIN) { obj.y = MARGIN; obj.vy = Math.abs(obj.vy); }
            if (obj.y + obj.h > H - MARGIN) { obj.y = H - MARGIN - obj.h; obj.vy = -Math.abs(obj.vy); }
        });

        // Collision detection between pairs
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const a = objects[i], b = objects[j];
                if (rectsOverlap(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h, 1)) {
                    resolveCollision(a, b);
                }
            }
        }

        // Apply positions
        objects.forEach(obj => {
            obj.el.style.left = obj.x + 'px';
            obj.el.style.top = obj.y + 'px';
        });
    }

    rafId = requestAnimationFrame(tick);
}

function resolveCollision(a, b) {
    // Find overlap on each axis
    const overlapX = (a.x + a.w / 2) - (b.x + b.w / 2);
    const overlapY = (a.y + a.h / 2) - (b.y + b.h / 2);

    // Swap velocity components based on dominant axis of collision
    if (Math.abs(overlapX) > Math.abs(overlapY)) {
        // Horizontal collision dominant
        const tmpVx = a.vx; a.vx = b.vx; b.vx = tmpVx;
        // Separate them
        const sep = (a.w / 2 + b.w / 2) - Math.abs(overlapX) + 2;
        if (overlapX > 0) { a.x += sep / 2; b.x -= sep / 2; }
        else { a.x -= sep / 2; b.x += sep / 2; }
    } else {
        // Vertical collision dominant
        const tmpVy = a.vy; a.vy = b.vy; b.vy = tmpVy;
        const sep = (a.h / 2 + b.h / 2) - Math.abs(overlapY) + 2;
        if (overlapY > 0) { a.y += sep / 2; b.y -= sep / 2; }
        else { a.y -= sep / 2; b.y += sep / 2; }
    }
}

// ─────────────────────────────────────────────────
// AUDIO PREVIEW
// ─────────────────────────────────────────────────
const previewAudio = new Audio('asset/sound/KFbeing_00.mp3');
previewAudio.loop = false;
previewAudio.volume = 0.8;

let audioUnlocked = false;
const unlockOverlay = document.getElementById('audio-unlock');
if (unlockOverlay) {
    unlockOverlay.addEventListener('click', () => {
        // Unlock audio on first user interaction
        previewAudio.play().then(() => {
            previewAudio.pause();
            previewAudio.currentTime = 0;
        }).catch(() => { });
        audioUnlocked = true;
        unlockOverlay.style.display = 'none';
    });
}

// ─────────────────────────────────────────────────
// HOVER / FREEZE
// ─────────────────────────────────────────────────
let modalOpen = false;

function onFilledHover(e) {
    frozen = true;
    document.body.classList.add('freeze');
    e.currentTarget.classList.add('hovered');
    objects.forEach(o => { o.el.style.cursor = 'default'; });
    e.currentTarget.style.cursor = 'pointer';

    if (audioUnlocked) {
        // Resume from where it paused
        previewAudio.play().catch(() => { });
    }
}

function onFilledLeave(e) {
    if (modalOpen) return;
    frozen = false;
    document.body.classList.remove('freeze');
    e.currentTarget.classList.remove('hovered');

    objects.forEach(o => {
        if (o.id === 'ENTITY_DENSITY') o.el.style.cursor = 'pointer';
    });

    // Pause (keep position)
    previewAudio.pause();
}

// ─────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('modal-close');

function openModal(obj) {
    modalOpen = true;
    frozen = true;
    overlay.classList.add('open');
    // Stop preview audio when entering conversation
    previewAudio.pause();
    objects.forEach(o => {
        o.el.classList.remove('hovered');
        o.el.style.cursor = 'default';

        // Pause pulse animation for all shapes except the clicked one
        if (!obj || o.id !== obj.id) {
            o.el.style.animationPlayState = 'paused';
        }
    });

    // Set modal metadata and widget
    const modalName = document.querySelector('.modal-name');
    const widgetContainer = document.querySelector('.widget-container');

    let agentId = 'agent_3101kjq6p68aexcaw96a1zkrxsbf'; // KF being
    modalName.textContent = 'KF being';

    if (widgetContainer) {
        widgetContainer.innerHTML = `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`;
    }
}

function closeModal() {
    modalOpen = false;
    overlay.classList.remove('open');
    frozen = false;
    document.body.classList.remove('freeze');
    objects.forEach(o => {
        o.el.classList.remove('hovered');
        if (o.id === 'ENTITY_DENSITY') o.el.style.cursor = 'pointer';

        // Resume pulse animation for all shapes
        o.el.style.animationPlayState = 'running';
    });

    // Force widget reload to stop audio/call
    const widgetContainer = document.querySelector('.widget-container');
    if (widgetContainer) {
        // Get the current active agent id
        const currentAgentId = widgetContainer.querySelector('elevenlabs-convai')?.getAttribute('agent-id') || 'agent_3101kjq6p68aexcaw96a1zkrxsbf';
        // Wiping and re-rendering forces the widget component to reset
        widgetContainer.innerHTML = '';
        setTimeout(() => {
            widgetContainer.innerHTML = `<elevenlabs-convai agent-id="${currentAgentId}"></elevenlabs-convai>`;
        }, 50);
    }
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
initObjects();
buildDOM();
tick();
