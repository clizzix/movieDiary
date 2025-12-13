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

function openDialog(html) {
  dialogContent.innerHTML = html;
  searchDialog.showModal();
}

dialogCloseBtn.addEventListener('click', () => searchDialog.close());

// clear the movies container
function clearMovies() {
  moviesContainer.innerHTML = '';
}
//first moviecard
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add(
    'bg-slate-950',
    'p-6',
    'text-white',
    'rounded-xl',
    'border-2',
    'border-sky-500',
    'shadow-lg',
    'shadow-sky-500/30',
    'h-full'
  );

  // wrapper
  const body = document.createElement('div');
  body.classList.add(
    'movie-card-body',
    'flex',
    'flex-col',
    'gap-6',
    'items-center',
    'h-full'
  );

  // image
  const img = document.createElement('img');
  img.classList.add('w-48', 'h-auto', 'object-cover', 'flex-shrink-0');

  if (movie.poster_path) {
    img.src = `${IMG_BASE_URL}${movie.poster_path}`;
    img.alt = `${movie.title} Poster`;
  } else {
    img.alt = 'No image available';
  }

  // content column (title, info, button)
  const content = document.createElement('div');
  content.classList.add(
    'flex',
    'flex-col',
    'gap-3',
    'text-center',
    'self-stretch',
    'flex-1' //
  );

  const title = document.createElement('h3');
  title.classList.add('text-2xl', 'md:text-3xl');
  title.textContent = movie.title;

  const info = document.createElement('p');
  info.classList.add('text-slate-300', 'text-sm');

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : 'N/A';
  info.textContent = `Year: ${year} • Rating: ${rating}`;

  // favourites button
  const favBtn = document.createElement('button');

  const setFavBtnState = () => {
    if (isFavourite(movie.id)) {
      favBtn.textContent = 'In favourites';
      favBtn.disabled = true;
      favBtn.className =
        'mt-auto bg-slate-700 rounded-xl px-4 py-2 text-sm cursor-not-allowed';
    } else {
      favBtn.textContent = 'Add to favourites';
      favBtn.disabled = false;
      favBtn.className =
        'mt-auto bg-sky-500 rounded-xl px-4 py-2 text-sm hover:bg-sky-600 cursor-pointer';
    }
  };

  setFavBtnState();

  favBtn.addEventListener('click', () => {
    const favourites = getFavouriteMovies();

    if (!favourites.some((m) => m.id === movie.id)) {
      favourites.push(movie);
      saveFavouriteMovies(favourites);
    }

    setFavBtnState();
  });

  // build
  content.appendChild(title);
  content.appendChild(info);
  content.appendChild(favBtn);

  body.appendChild(img);
  body.appendChild(content);

  card.appendChild(body);

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
        openDialog(`No movies found for "<strong>${query}</strong>"`);
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
    openDialog('Please enter a search term.');

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
