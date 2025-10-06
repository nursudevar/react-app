import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres, getMoviesByGenre } from "../services/api";
import "../styles/genres.scss";
import MovieCard from "../components/MovieCard"; 



//The Genres component is only responsible from pulling the Genre List from the API and display it.

//We define the loading and error states separately in both functions, even though they are located on the same page.
//This is because the loading and error states we defined in the genre function are valid for that genre list.
//Likewise, the states we define in the genre row are only valid for that row.

//If we only write one loading or error state, one line of error would effect whole page.




export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");



  //In the first render, we pull genre list. 

  //Ignore is useful for when the user changes the page quickly. We can think of it as not keeping the line busy.
  //It is a safety flag to prevent updating state after the component has been removed from the screen.

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getGenres(); //Pull genre list from the API.
        if (!ignore) setGenres(data); //Update state.
      } catch (e) {
        if (!ignore) setErr(e.message || "Failed to fetch genres.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };  //When component unmounts(disappear), set ignore=true so no updates happen afterwards
  }, []);


  //Display these when the page is loading.
  if (loading) {
    return (
      <section className="genres-page">
        <h2 className="genres-title">Movie Genres</h2>
        <p className="muted">Loading genres…</p>
      </section>
    );
  }

  //Display these if there is an error.

  if (err) {
    return (
      <section className="genres-page">
        <h2 className="genres-title">Movie Genres</h2>
        <p className="error">Error: {err}</p>
      </section>
    );
  }

  return (

    //map performs an operation on each element of an array and returns a new array.
    //It is most commonly used for rendering lists.
    //It is frequently used to display data received from an API.

    <section className="genres-page">
      <h2 className="genres-title">Movie Genres</h2>

      <div className="genres-list">
        {genres.map((g) => (
          <Link key={g.id} to={`/genre/${g.id}`} className="genre-pill">
            {g.name}
          </Link>
        ))}
      </div>

      <div className="genre-rows">
        {genres.map((g) => (
          <GenreRow key={g.id} genre={g} />
        ))}
      </div>
    </section>
      //We take rows separate because each row is different from each other in case of genres, loading force and errors. 

  );
}


//The GenreRow component is responsible from displaying the films from a single genre.


function GenreRow({ genre }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const anchorRef = useRef(null);  
  const scrollerRef = useRef(null);

  //useRef creates an unchanging reference. (Değişmeyen referans) This reference is used to store a DOM element or any value.
  //We use it to reach that element. => <div ref={anchorRef}></div>

  useEffect(() => {
    let loaded = false; //loaded === false means component is still active → state can be updated.
    const el = anchorRef.current;
    if (!el) return;


    //In this code block, a scroll-based data loading (lazy loading / prefetch) mechanism is established at the browser level.
    const obs = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loaded) { // If it has entered the screen and has not been loaded before
          loaded = true;                       // Don't trigger it again
          obs.disconnect();                    // Close Observer (to boost performance)
          try {
            setLoading(true);
            setErr("");
            const list = await getMoviesByGenre(genre.id, 1, "popularity.desc");
            setMovies((list || []).slice(0, 15));
          } catch (e) {
            setErr(e.message || "Failed to fetch movies.");
          } finally {
            setLoading(false);
          }
        }
      },
      { rootMargin: "200px" } //We say trigger 200 pixels before the element enters the visible area
      //This is done to ensure smoother and earlier loading.
    );

    obs.observe(el);
    return () => obs.disconnect(); // Cleanup: close observer while component is being removed
  }, [genre.id]); // If the type ID changes, this line is rebuilt.

  const scrollBy = (delta) => { // delta: left/right shift in pixels
    const el = scrollerRef.current; //Get the scroll container, exit if there is no ref, else scroll.
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="genre-row" ref={anchorRef}>
      <div className="row-header">
        <h3 className="row-title">{genre.name}</h3>
        <Link to={`/genre/${genre.id}`} className="row-view-all">
          View all →
        </Link>
      </div>

      <div className="row-scroller" ref={scrollerRef}>
        {loading && <div className="row-loading muted">Loading…</div>}
        {err && <div className="row-error">Error: {err}</div>}

        {!loading && !err && movies.map((m) => <MovieThumb key={m.id} movie={m} />)}
      </div>

      <button
        aria-label="Scroll left"
        className="row-btn row-btn--left"
        onClick={() => scrollBy(-Math.max(320, window.innerWidth * 0.8))}
      >
        ‹
      </button>
      <button
        aria-label="Scroll right"
        className="row-btn row-btn--right"
        onClick={() => scrollBy(Math.max(320, window.innerWidth * 0.8))}
      >
        ›
      </button>
    </section>
  );
}

function MovieThumb({ movie }) {
  return (
    <article className="thumb-card">
      <MovieCard movie={movie} />
    </article>
  );
}
