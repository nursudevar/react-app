import MovieCard from "../components/MovieCard";
import { useState, useEffect} from "react";
import { searchMovies, getPopularMovies} from "../services/api";
import '../styles/Home.scss';


function Home(){

    //to persist to function properly we use it in this way. If we didn't use useState, the input value would not be retained between renders. The value would be reset to the initial state on every re-render.
    const [searchQuery, setSearchQuery] = useState(""); 
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 


    useEffect( () => {

        const loadPopularMovies = async () => {

            try{
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch(err) {
                console.log(err)
                setError("Failed to load movies");
            }
            finally{
                setLoading(false);
            }
        }

        loadPopularMovies();

    }, [])


    const handleSearch = (e) => {
        e.preventDefault(); //to stop the page refresh everytime we clicked search button
        alert(searchQuery);
    };

    return (
    <div className="home">

        <form onSubmit={handleSearch} className="search-form">

            <input
                type="text" 
                placeholder="Search for Movies" 
                className="search-input" 
                value={searchQuery} 
                onChange= {(e) => 
                    {
                        setSearchQuery(e.target.value);
                        console.log(e.target.value);
                    }}

               
               
            />

            <button type="submit" className="search-btn">Search</button>
        </form>

        {error &&
            <div className="error-message">
                {error}
            </div>
        }


        {loading ? 
        <div className="loading">Loading</div> 
                 : 
                 
            <div className="movies-grid">
                {movies.map((movie) => 
                    movie.title.toLowerCase().startsWith(searchQuery.trim().toLowerCase()) && (
                    <MovieCard movie = {movie} key={movie.id}/> )
                )}
            </div>
        };
       
    </div>
    );
}


export default Home;