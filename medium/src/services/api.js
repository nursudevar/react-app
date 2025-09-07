//This file is will be responsible for just for making API callsç. That is why I used js instead of jsx.

const API_KEY="7f9ce10aee35e9519199ab53ea386fa2";
const BASE_URL="https://api.themoviedb.org/3";


// Async is used for operations that may take time (Fetching data from an API, reading files, etc.)

//Fetch is used for sending a network request.


export const getPopularMovies = async() => {
    const response = await fetch (`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};


export const searchMovies = async(query) => {
    const response = await fetch (
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    return data.results;

}