// const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
// const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json',
//         Authorization:
//             'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmI0NWNiMmNhMzFiZGJmMTIxYzA5ZTY4NmNiYThlMiIsIm5iZiI6MTc2Mjg2OTU5MC44NzMsInN1YiI6IjY5MTM0MTU2ZTlhMGUxNTI3Y2QyNjI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ufln2p4E1HaD6bhRyUitoixovWuMcbxiubpFQ7VV6Eg',
//     },
// };

const container = document.getElementById('movie-cards');
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// const fetchPopularMovies = async () => {
//     try {
//         const res = await fetch(url, options);
//         const data = await res.json();
//         createMovieCards(data.results);
//     } catch (e) {
//         console.error(e);
//     }
// };

const showCustomAlert = (message, type = 'info') => {
    const alertEl = document.createElement('div');
    alertEl.textContent = message;

    // Base classes
    alertEl.classList.add(
        'fixed',
        'top-1/2',
        'left-1/2',
        '-translate-x-1/2',
        '-translate-y-1/2',
        'p-4',
        'rounded-lg',
        'text-white',
        'shadow-lg',
        'z-50',
        'transition-opacity',
        'duration-300'
    );

    // Type-specific classes
    if (type === 'success') {
        alertEl.classList.add('bg-green-500');
    } else if (type === 'error') {
        alertEl.classList.add('bg-red-500');
    }

    document.body.appendChild(alertEl);

    setTimeout(() => {
        alertEl.classList.add('opacity-0');
        alertEl.addEventListener('transitionend', () => alertEl.remove());
    }, 3000);
};

const renderFavoriteMovies = () => {
    const storedMoviesString = localStorage.getItem('favouriteMovies') || '[]';
    const favoriteMovies = JSON.parse(storedMoviesString);
    createMovieCards(favoriteMovies);
};

const createMovieCards = (movies) => {
    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add(
            'bg-slate-950',
            'mb-8', // Use margin-bottom instead of margin on all sides
            'p-8', // Keep padding
            'text-white',
            'rounded-xl',
            'relative',
            'border-2',
            'border-sky-500',
            'shadow-lg',
            'shadow-sky-500/30'
        );
        movieCard.innerHTML = `
            <div class="movie-card-body flex flex-col md:flex-row gap-8 items-center">
              <button class="delete-btn absolute top-4 right-4" data-movie-id="${
                  movie.id
              }"><span class="material-symbols-outlined bg-red-500 p-2 rounded-xl hover:bg-red-800 cursor-pointer">delete</span></button>
              <img class="w-48 h-auto object-cover flex-shrink-0" src=${imageBaseUrl}${
            movie.poster_path
        } alt="${movie.original_title} Poster" />
            <div class="flex flex-1 justify-center">
                <div class="flex flex-col gap-4 max-w-prose text-center">
                    <h3 class="text-3xl">${movie.original_title}</h3>
                    <p>${movie.overview}</p>
                    <form class="note-form flex gap-4" data-movie-id="${
                        movie.id
                    }">
                        <input type="text" name="note" class="note-input w-full rounded-xl bg-slate-800 p-2 text-white placeholder-slate-400" placeholder="Add a note..." />
                        <button class="bg-sky-500 rounded-xl px-1.5 hover:bg-sky-600 cursor-pointer" type="submit">Submit</button>
                    </form>
                    <details class="note-details text-left self-start w-full bg-slate-800/50 rounded-lg p-2">
                        <summary class="cursor-pointer hover:text-sky-400">View Note</summary>
                        <p class="note-content mt-2 p-2 bg-slate-900/70 rounded">${
                            movie.note || 'No note saved yet.'
                        }</p>
                    </details>
                </div>
            </div>
            </div>`;
        container.appendChild(movieCard);
    });
};

const updateNote = (form, noteText) => {
    const card = form.closest('.movie-card-body');
    const noteDetails = card.querySelector('.note-details');
    if (noteDetails) {
        const noteContent = noteDetails.querySelector('.note-content');
        noteContent.textContent = noteText;
    }
};

container.addEventListener('submit', (e) => {
    if (!e.target.classList.contains('note-form')) {
        return;
    }

    e.preventDefault();

    const form = e.target;
    const movieId = form.dataset.movieId;
    const noteInput = form.querySelector('.note-input');
    const noteText = noteInput.value;

    if (!noteText) {
        showCustomAlert('Please enter a note before saving.', 'error');
        return;
    }

    const storedMovies = JSON.parse(
        localStorage.getItem('favouriteMovies') || '[]'
    );

    const updatedMovies = storedMovies.map((movie) => {
        if (movie.id.toString() === movieId) {
            return { ...movie, note: noteText };
        }
        return movie;
    });

    localStorage.setItem('favouriteMovies', JSON.stringify(updatedMovies));

    showCustomAlert('Note saved successfully!', 'success');

    updateNote(form, noteText);
    form.reset();
});

container.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.delete-btn');

    if (!deleteButton) {
        return;
    }

    const movieId = deleteButton.dataset.movieId;

    const favoriteMovies = JSON.parse(
        localStorage.getItem('favouriteMovies') || '[]'
    );
    const updatedMovies = favoriteMovies.filter(
        (movie) => movie.id.toString() !== movieId
    );
    localStorage.setItem('favouriteMovies', JSON.stringify(updatedMovies));

    const cardToRemove = deleteButton.closest('.bg-slate-950');
    if (cardToRemove) {
        cardToRemove.remove();
    }
});

// fetchPopularMovies();
renderFavoriteMovies();
