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
            'm-8',
            'p-8',
            'text-white',
            'rounded-xl',
            'border-2',
            'border-sky-500',
            'shadow-lg',
            'shadow-sky-500/30'
        );
        movieCard.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8 items-center">
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

const updateNoteInDOM = (form, noteText) => {
    const card = form.closest('.flex-col.md\\:flex-row');
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
        alert('Please enter a note before saving.');
        return;
    }

    const storedMovies = JSON.parse(
        localStorage.getItem('favoriteMovies') || '[]'
    );

    const updatedMovies = storedMovies.map((movie) => {
        if (movie.id.toString() === movieId) {
            return { ...movie, note: noteText };
        }
        return movie;
    });

    localStorage.setItem('favoriteMovies', JSON.stringify(updatedMovies));

    alert(`Note saved for movie ID: ${movieId}!`);

    updateNoteInDOM(form, noteText);
    form.reset();
});

// fetchPopularMovies();
renderFavoriteMovies();
