// First, add the required styles
const forceStyles = document.createElement('style');
forceStyles.textContent = `
.movie-carousel {
    width: 100%;
    position: relative;
    margin: 8px 0;
    padding: 0 25px;
}

.carousel-container {
    width: 100%;
    overflow: hidden;
    position: relative;
}

.carousel-track {
    display: flex;
    gap: 8px;
    transition: transform 0.3s ease;
}

.carousel-item {
    flex: 0 0 100px;
    height: 56px;
    border-radius: 4px;
    overflow: hidden;
}

.carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.75);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-button.prev { left: 0; }
.carousel-button.next { right: 0; }

.carousel-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
`;
document.head.appendChild(forceStyles);

// Function to create carousel HTML
function createCarousel(movie) {
    const carousel = document.createElement('div');
    carousel.className = 'movie-carousel';
    
    // Create navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button prev';
    prevButton.innerHTML = '←';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button next';
    nextButton.innerHTML = '→';
    
    // Create carousel container and track
    const container = document.createElement('div');
    container.className = 'carousel-container';
    
    const track = document.createElement('div');
    track.className = 'carousel-track';
    
    // Create thumbnails (5 items)
    for (let i = 0; i < 5; i++) {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = `${IMG_PATH}${movie.backdrop_path}`;
        img.alt = `${movie.title} thumbnail ${i + 1}`;
        
        item.appendChild(img);
        track.appendChild(item);
    }
    
    // Assemble carousel
    container.appendChild(track);
    carousel.appendChild(prevButton);
    carousel.appendChild(container);
    carousel.appendChild(nextButton);
    
    return { carousel, track, prevButton, nextButton };
}

// Function to handle carousel controls
function initializeCarousel(carousel, track, prevButton, nextButton) {
    let currentIndex = 0;
    const itemWidth = 108; // 100px width + 8px gap
    const itemsCount = track.children.length;
    
    function updateButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= itemsCount - 3;
    }
    
    function moveCarousel(direction) {
        if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        } else if (direction === 'next' && currentIndex < itemsCount - 3) {
            currentIndex++;
        }
        
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateButtons();
    }
    
    prevButton.addEventListener('click', () => moveCarousel('prev'));
    nextButton.addEventListener('click', () => moveCarousel('next'));
    
    // Initial button state
    updateButtons();
}

// Modified showRecommended function to add carousels
const originalShowRecommended = showRecommended;
showRecommended = function(movies) {
    // Call original function first
    originalShowRecommended(movies);
    
    // Add carousels to all movie elements
    const movieElements = document.querySelectorAll('.movie-l, .movie-s');
    movieElements.forEach((movieEl, index) => {
        if (movies[index] && movies[index].backdrop_path) {
            // Create carousel elements
            const { carousel, track, prevButton, nextButton } = createCarousel(movies[index]);
            
            // Insert carousel after the main movie image
            const mainImage = movieEl.querySelector('img');
            mainImage.parentNode.insertBefore(carousel, mainImage.nextSibling);
            
            // Initialize carousel controls
            initializeCarousel(carousel, track, prevButton, nextButton);
        }
    });
};

// Also update the search results to include carousels
const originalSearchMovies = searchMovies;
searchMovies = function(movies) {
    // Call original function first
    originalSearchMovies(movies);
    
    // Add carousels to search results
    const movieElements = document.querySelectorAll('.movie-s');
    movieElements.forEach((movieEl, index) => {
        if (movies[index] && movies[index].backdrop_path) {
            const { carousel, track, prevButton, nextButton } = createCarousel(movies[index]);
            const mainImage = movieEl.querySelector('img');
            mainImage.parentNode.insertBefore(carousel, mainImage.nextSibling);
            initializeCarousel(carousel, track, prevButton, nextButton);
        }
    });
};