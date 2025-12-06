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
  card.appendChild(img);
  card.appendChild(title);
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
