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

const fetchPopularMovies = async () => {
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        console.log(data);
    } catch (e) {
        console.error(e);
    }
};

fetchPopularMovies();
