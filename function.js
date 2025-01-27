const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';
const PROVIDER_API = 'https://api.themoviedb.org/3/movie/';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

function initCarousel(horizontalList) {
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let previousTranslate = 0;
  let currentIndex = 0;
  let animationID = 0;
  let startTime = null;

  horizontalList.addEventListener('dragstart', (e) => e.preventDefault());

  horizontalList.addEventListener('touchstart', touchStart);
horizontalList.addEventListener('touchmove', touchMove);
horizontalList.addEventListener('touchend', touchEnd);

horizontalList.addEventListener('mousedown', touchStart);
horizontalList.addEventListener('mousemove', touchMove);
horizontalList.addEventListener('mouseup', touchEnd);
horizontalList.addEventListener('mouseleave', touchEnd);

function touchStart(event) {
  startTime = new Date();
  isDragging = true;
  startPosition = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  horizontalList.style.cursor = 'grabbing';
  horizontalList.style.transition = 'none';
}

function touchMove(event) {
  if (!isDragging) return;
  const currentPosition = getPositionX(event);
  const moveDistance = currentPosition - startPosition;
  currentTranslate = previousTranslate + moveDistance;
  if (currentTranslate > 0) {
    currentTranslate = currentTranslate / 3;
  } else if (currentTranslate < -getMaxTranslate()) {
    const overflowTranslate = currentTranslate + getMaxTranslate();
    currentTranslate = -getMaxTranslate() + (overflowTranslate / 3);
  }
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  horizontalList.style.cursor = 'grab';
  const endTime = new Date();
  const timeElapsed = endTime - startTime;
  const moveDistance = currentTranslate - previousTranslate;
  const velocity = Math.abs(moveDistance) / timeElapsed;
  if (velocity > 0.5) {
    const momentum = velocity * 100 * (moveDistance < 0 ? -1 : 1);
    currentTranslate = previousTranslate + momentum;
  }
  currentTranslate = Math.max(
    Math.min(currentTranslate, 0),
    -getMaxTranslate()
  );
  horizontalList.style.transition = 'transform 0.5s ease-out';
  setTransform();
  previousTranslate = currentTranslate;
}

function animation() {
  setTransform();
  if (isDragging) requestAnimationFrame(animation);
}

function getPositionX(event) {
  return event.type.includes('mouse') 
    ? event.pageX 
    : event.touches[0].clientX;
}

function setTransform() {
  horizontalList.style.transform = `translateX(${currentTranslate}px)`;
}

function getMaxTranslate() {
  return horizontalList.scrollWidth - horizontalList.clientWidth;
}
}

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (search.value && search.value !== "") {
    searchMovies(data.results);
  } else {   
    showRecommended(data.results);
  }
}

async function getMovieProviders(movieId) {
  const res = await fetch(`${PROVIDER_API}${movieId}/watch/providers?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
  const data = await res.json();
  return data.results;
}

function showRecommended(movies) {
  main.innerHTML = "";
  const mostPopularMovies = document.createElement("div");
  const recommendedMovies = document.createElement("div");
  recommendedMovies.innerHTML = "<h2>Recommended for you</h2>";
  const horizontalList = document.createElement("div");

  mostPopularMovies.classList.add("most-popular");
  recommendedMovies.classList.add("recommended");
  horizontalList.classList.add("horizontal-list");

  horizontalList.style.cursor = 'grab';
  horizontalList.style.userSelect = 'none';
  horizontalList.style.touchAction = 'pan-y pinch-zoom';

  mostPopularMovies.appendChild(horizontalList);
  main.appendChild(mostPopularMovies);
  main.appendChild(recommendedMovies);

  movies.forEach((movie, index) => {
    const { title, backdrop_path, vote_average, overview } = movie;
    const movieElement = document.createElement("div");

    let streamLink = '';

    if (index < 5) {
      movieElement.classList.add("movie-l");
      movieElement.innerHTML = ` 
            <img src="${IMG_PATH + backdrop_path}" alt="${title}">
            <div class="movie-info">
                 <h3>${title}</h3>
             </div>
             <div class="overview ${index >= 5 ? "hidden" : "visible"}">
                 <p>${overview}</p>
                 <div class="buttons">
                     <button class="watch-now">Stream</button>
                     <button class="watch-later">+</button>
                 </div>
             </div>
             
        `;
    } else {
      movieElement.classList.add("movie-s");
      movieElement.innerHTML = ` 
            <img src="${IMG_PATH + backdrop_path}" alt="${title}">
            <div class="movie-info">
                 <h3>${title}</h3>
                 <span class="vote">★ ${vote_average}</span>
             </div>
             <div class="overview ${index >= 5 ? "hidden" : "visible"}">
             <h3>${title}</h3> 
                 <p>${overview}</p>
                 <div class="buttons">
                     <button class="watch-now">Stream</button>
                     <button class="watch-later">+</button>
                 </div>
             </div>
        `;
    }

    if (index < 6) {
      horizontalList.appendChild(movieElement);
    } else {
      recommendedMovies.appendChild(movieElement);
    }
  });

  initCarousel(horizontalList);
}

function searchMovies(movies) {
  main.innerHTML = "";
  const searchResults = document.createElement("div");
  searchResults.classList.add("recommended");
  searchResults.innerHTML = "<h2>Search Results</h2>";

  movies.forEach((movie) => {
    const { title, backdrop_path, vote_average, overview } = movie;
    const movieElement = document.createElement("div");

    movieElement.classList.add("movie-s");
    movieElement.innerHTML = ` 
        <img src="${IMG_PATH + backdrop_path}" alt="${title}">
        <div class="movie-info">
             <h3>${title}</h3>
             <span class="vote">★ ${vote_average}</span>
         </div>
         <div class="overview hidden">
             <h3>${title}</h3> 
             <p>${overview}</p>
             <div class="buttons">
                 <button class="watch-now">Stream</button>
                 <button class="watch-later">+</button>
             </div>
         </div>
    `;

    searchResults.appendChild(movieElement);
  });

  main.appendChild(searchResults);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm) {
    main.innerHTML = "<h2>Searching...</h2>";
    getMovies(SEARCH_API + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

getMovies(API_URL);
