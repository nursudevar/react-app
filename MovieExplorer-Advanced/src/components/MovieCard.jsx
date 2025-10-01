import { FaRegHeart } from "react-icons/fa";
import '../styles/MovieCard.scss';
import { useMovieContext } from "../contexts/MovieContext";
import noImage from "../images/no-image.svg";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

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
        <Link to={`/movie/${movie.id}`} className="movie-link">
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
                <p className="movie-sub">
                    <span className="star-badge">  <AiFillStar className="star-icon" /> {movie.vote_average?.toFixed?.(1) ?? "—"}</span>
                    •
                    <span className="release-date">{movie.release_date || "—"}</span>
                </p>

            </div>
        </div>
        </Link>
        
    )
}

//The toFfixed part converts the number to a string by fixing the number of decimal places.
//(1) means, one number after the comma.

//vote_Average? means if vote_average exists and is a number, access the toFixed method.

// ?? means If the expression on the left is undefined (or null), show "—".


export default MovieCard;