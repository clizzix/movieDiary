const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmI0NWNiMmNhMzFiZGJmMTIxYzA5ZTY4NmNiYThlMiIsIm5iZiI6MTc2Mjg2OTU5MC44NzMsInN1YiI6IjY5MTM0MTU2ZTlhMGUxNTI3Y2QyNjI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ufln2p4E1HaD6bhRyUitoixovWuMcbxiubpFQ7VV6Eg',
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((data) => {
    // data.results contains the list of popular movies
    renderMovies(data.results);
  })
  .catch((err) => console.error(err));
const BASE_URL = 'https://api.themoviedb.org/3';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
//local storage key for favourite movies
const FAV_STORAGE_KEY = 'favouriteMovies';
//DOM elements
const moviesContainer = document.getElementById('movies-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
//dialog elements
const searchDialog = document.getElementById('search-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogCloseBtn = document.getElementById('dialog-close');
// clear the movies container
function clearMovies() {
  moviesContainer.innerHTML = '';
}
//first moviecard
function createMovieCard(movie) {
  const card = document.createElement('article');
  const img = document.createElement('img');
  if (movie.poster_path) {
    img.src = `${IMG_BASE_URL}${movie.poster_path}`;
    img.alt = movie.title;
  } else {
    img.alt = 'No image available';
  }
  const title = document.createElement('h2');
  title.textContent = movie.title;
  // favourites button
  const favBtn = document.createElement('button');

  if (isFavourite(movie.id)) {
    // already in favourites
    favBtn.textContent = 'In favourites';
    favBtn.disabled = true;
  } else {
    favBtn.textContent = 'Add to favourites';
    favBtn.disabled = false;
  }

  // click handler for favourites
  favBtn.addEventListener('click', () => {
    const favourites = getFavouriteMovies();

    // if ist already in fauvorites,no duplicate
    if (favourites.some((m) => m.id === movie.id)) {
      favBtn.textContent = 'In favourites';
      favBtn.disabled = true;
      return;
    }

    favourites.push(movie);
    saveFavouriteMovies(favourites);
    favBtn.textContent = 'In favourites';
    favBtn.disabled = true;

    console.log(`${movie.title} added to favourites`);
  });


  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(favBtn);
  return card;
}
//more movie cards
function renderMovies(movies) {
  clearMovies();

  if (!movies || movies.length === 0) {
    moviesContainer.textContent = 'No movies found.';
    return;
  }

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesContainer.appendChild(card);
  });
}
//search function
function searchMovies(query) {
  const searchUrl = `${BASE_URL}/search/movie?query=${encodeURIComponent(
    query
  )}`;
  fetch(searchUrl, options)
    .then((res) => res.json())
    .then((data) => {
      const movies = data.results;
      //alert if no movies found
      if (!movies || movies.length === 0) {
        alert(`No movies found for "${query}"`);
        renderMovies([]);
        return;
      }
      renderMovies(movies);
    })
    .catch((err) => console.error(err));
}
//event listener for search form
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  searchMovies(query);
});
//read favourite movies from local storage
function getFavouriteMovies() {
  try {
    const favs = localStorage.getItem(FAV_STORAGE_KEY);
    return favs ? JSON.parse(favs) : [];
  } catch (error) {
    console.error('Error reading favourite movies from local storage', error);
    return [];
  }
}
//save favourite movies to local storage
function saveFavouriteMovies(favs) {
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favs));
}
//check if a movie is in favourites
function isFavourite(movieId) {
  const favs = getFavouriteMovies();
  return favs.some((movie) => movie.id === movieId);
}
