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

async function get(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  // params varsa ekle
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}



export async function getGenres() {
    const data = await get("/genre/movie/list");
    return data.genres ?? [];
}

export async function getMoviesByGenre (genreId, page=1, sort = "popularity.desc"){
    const data = await get("/discover/movie", {
        with_genres: genreId,
        page,
        sort_by: sort,
    });

    return data.results ?? [];
}