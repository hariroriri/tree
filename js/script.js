let currentLevel = null;
let history = [];
let isAnimating = false;
let hoveredItem = null;
let lastScrollTime = 0;
const scrollThreshold = 300; // Minimum time between scroll actions in milliseconds

// Fetch and initialize data
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        currentLevel = data.roriri;
        render(currentLevel);
    })
    .catch(error => console.error('Error loading JSON data:', error));

// Render function to update the DOM based on the current level
function render(dataLevel) {
    if (isAnimating) return;

    isAnimating = true;
    const container = document.getElementById('container');
    
    // Fade out effect using GSAP
    gsap.to(container, {
        duration: 0.3,
        opacity: 0,
        scale: 0.85,
        ease: 'power1.out',
        onComplete: () => {
            container.innerHTML = ''; // Clear existing content

            // Create new elements based on data level
            if (typeof dataLevel === 'object' && !Array.isArray(dataLevel)) {
                Object.keys(dataLevel).forEach((key, index) => {
                    createNodeElement(key, dataLevel[key], index);
                });
            } else if (Array.isArray(dataLevel)) {
                dataLevel.forEach((entry, index) => {
                    createNodeElement(`${entry.name} - ${entry.role}`, entry, index);
                });
            } else {
                const div = document.createElement('div');
                div.className = 'item';
                div.textContent = dataLevel;
                container.appendChild(div);
            }

            // Fade in effect using GSAP
            gsap.fromTo(container, 
                { opacity: 0, scale: 0.85 },
                { duration: 0.3, opacity: 1, scale: 1, ease: 'power1.inOut', onComplete: () => {
                    isAnimating = false;
                }}
            );
        }
    });
}

// Helper function to create a node element
function createNodeElement(text, data, index) {
    const div = document.createElement('div');
    div.className = `item branch-item branch-${index}`;
    div.innerHTML = `
        <div class="item-title">${text}</div>
        ${data.details ? `<div class="item-details">
            ${Object.keys(data.details).map(key => `
                <div class="item-detail"><strong>${key}:</strong> ${typeof data.details[key] === 'object' ? 
                    data.details[key].join(', ') : data.details[key]}</div>
            `).join('')}
        </div>` : ''}
    `;

    div.addEventListener('mouseover', () => {
        hoveredItem = data;
        div.classList.add('zoomed');
    });
    
    div.addEventListener('mouseout', () => {
        hoveredItem = null;
        div.classList.remove('zoomed');
    });

    document.getElementById('container').appendChild(div);
}

// Zoom into the next level
function zoomIn(nextLevel) {
    if (isAnimating || !hoveredItem) return;

    if (currentLevel !== null) {
        history.push(currentLevel);
    }

    currentLevel = nextLevel;
    const container = document.getElementById('container');

    // Scale-up effect using GSAP
    gsap.to(container, {
        duration: 0.3,
        scale: 1.3,
        backgroundColor: '#d9e2f0',
        ease: 'power1.out',
        onComplete: () => {
            render(currentLevel);
        }
    });
}

// Zoom out to the previous level
function zoomOut() {
    if (isAnimating || history.length === 0) return;

    const container = document.getElementById('container');

    // Zoom-out effect using GSAP
    gsap.to(container, {
        duration: 0.3,
        scale: 0.7,
        backgroundColor: '#f9f9f9',
        ease: 'power1.in',
        onComplete: () => {
            currentLevel = history.pop();
            render(currentLevel);
        }
    });
}

// Handle mouse scroll for zoom in or out
window.addEventListener('wheel', (event) => {
    const now = new Date().getTime();
    if (now - lastScrollTime < scrollThreshold) return;
    lastScrollTime = now;

    if (event.deltaY < 0 && hoveredItem) {
        zoomIn(hoveredItem);
    } else if (event.deltaY > 0) {
        zoomOut();
    }
});
