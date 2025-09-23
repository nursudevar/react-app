import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres, getMoviesByGenre } from "../services/api";
import "../styles/genres.scss";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getGenres();
        if (!ignore) setGenres(data);
      } catch (e) {
        if (!ignore) setErr(e.message || "Failed to fetch genres.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (loading) {
    return (
      <section className="genres-page">
        <h2 className="genres-title">Movie Genres</h2>
        <p className="muted">Loading genres…</p>
      </section>
    );
  }

  if (err) {
    return (
      <section className="genres-page">
        <h2 className="genres-title">Movie Genres</h2>
        <p className="error">Error: {err}</p>
      </section>
    );
  }

  return (
    <section className="genres-page">
      <h2 className="genres-title">Movie Genres</h2>

      {/* Üstte: kategori pill'leri */}
      <div className="genres-list">
        {genres.map((g) => (
          <Link key={g.id} to={`/genre/${g.id}`} className="genre-pill">
            {g.name}
          </Link>
        ))}
      </div>

      {/* Altta: her genre için yatay slider */}
      <div className="genre-rows">
        {genres.map((g) => (
          <GenreRow key={g.id} genre={g} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------ alt bileşenler ------------------------ */

function GenreRow({ genre }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const anchorRef = useRef(null);     // görünürlüğü takip için
  const scrollerRef = useRef(null);   // yatay kaydırıcı

  // Lazy-load: satır görünür olunca 1 kez yükle
  useEffect(() => {
    let loaded = false;
    const el = anchorRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          loaded = true;
          obs.disconnect();
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
      { rootMargin: "200px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [genre.id]);

  const scrollBy = (delta) => {
    const el = scrollerRef.current;
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

        {!loading &&
          !err &&
          movies.map((m) => <MovieThumb key={m.id} movie={m} />)}
      </div>

      {/* kaydırma butonları */}
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
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "https://placehold.co/342x513?text=No+Image";

  return (
    <article className="thumb-card">
      <img className="thumb-poster" src={poster} alt={movie.title} />
      <h4 className="thumb-title">{movie.title}</h4>
    </article>
  );
}
