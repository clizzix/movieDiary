const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmI0NWNiMmNhMzFiZGJmMTIxYzA5ZTY4NmNiYThlMiIsIm5iZiI6MTc2Mjg2OTU5MC44NzMsInN1YiI6IjY5MTM0MTU2ZTlhMGUxNTI3Y2QyNjI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ufln2p4E1HaD6bhRyUitoixovWuMcbxiubpFQ7VV6Eg',
    },
};

const container = document.getElementById('movie-cards');
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const fetchPopularMovies = async () => {
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        createMovieCards(data.results);
    } catch (e) {
        console.error(e);
    }
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
            'border-blue-800',
            'shadow-lg',
            'shadow-blue-800/50'
        );
        movieCard.innerHTML = `
            <div class="flex gap-8 items-center">
              <img class="w-48 h-auto object-cover flex-shrink-0" src=${imageBaseUrl}${movie.poster_path} alt="${movie.original_title} Poster" />
            <div class="flex flex-1 justify-center">
                <div class="flex flex-col gap-4 max-w-prose text-center">
                    <h3 class="text-3xl">${movie.original_title}</h3>
                    <p>${movie.overview}</p>
                </div>
            </div>
            </div>`;
        container.appendChild(movieCard);
    });
};

fetchPopularMovies();
