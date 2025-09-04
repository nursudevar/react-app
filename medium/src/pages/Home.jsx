import MovieCard from "../components/MovieCard";
import { useState} from "react";


function Home(){


    const movies= [
        {id: 1, title: "John Wick", release_date: "2020"},
        {id: 2, title: "Harry Potter", release_date: "2012"},
        {id: 3, title: "Inception", release_date: "2010"},
        {id: 4, title: "The Dark Knight", release_date: "2008"},
        {id: 5, title: "Pulp Fiction", release_date: "1994"},
        {id: 6, title: "The Shawshank Redemption", release_date: "1994"},
        {id: 7, title: "The Godfather", release_date: "1972"},
        {id: 8, title: "The Dark Knight Rises", release_date: "2012"}, 

    ]
    const handleSearch = () => {


    }
    return (
    <div className="home">

        <form onSubmit={handleSearch} className="search-form">

            <input type="text" placeholder="Search for Movies" className="search-input"/>
            <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="movies-grid">
            {movies.map((movie) => 
                <MovieCard movie = {movie} key={movie.id}/>)
            }
        </div>
    </div>
    );
}


export default Home;