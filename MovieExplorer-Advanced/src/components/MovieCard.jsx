import { FaRegHeart } from "react-icons/fa";
import '../styles/MovieCard.scss';
import { useMovieContext } from "../contexts/MovieContext";
import noImage from "../images/no-image.svg";

function MovieCard({movie}){

    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext() 

    const favorite = isFavorite(movie.id)

    function onFavorite(e){
       e.preventDefault()
       if (favorite) removeFromFavorites(movie.id)
       else addToFavorites(movie)

    }


    const imgPath = movie.poster_path || movie.backdrop_path;


    const src = imgPath
                ? `https://image.tmdb.org/t/p/w500${imgPath}`
                : noImage;


    return(

        <div className="movie-card">
            <div className="movie-poster">
                <img 
                    src={src} 
                    alt={movie.title}
                    onError={(e) => {
                        e.currentTarget.onerror= null; //to prevent loop
                        e.currentTarget.src= noImage;
                    }}
                />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ?  "active" : ""}`} onClick={onFavorite}>
                       ♥
                    </button>
                </div>
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p> 
                {/*we split release date according to - and then just take the stated value in the array. 
                    Deleted other values into displaying. So we have now just the release year. */}
            </div>
        </div>
    )
}



export default MovieCard;