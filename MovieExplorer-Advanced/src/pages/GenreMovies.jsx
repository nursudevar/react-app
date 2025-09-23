import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getMoviesByGenre, getGenres } from "../services/api";
import "../styles/GenreMovies.scss"

export default function GenreMovies() {
  const { genreId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1);

  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Breadcrumb için genre adı
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await getGenres();
        const found = list.find((g) => String(g.id) === String(genreId));
        if (!ignore) setGenreName(found?.name || "Genre");
      } catch {
        if (!ignore) setGenreName("Genre");
      }
    })();
    return () => { ignore = true; };
  }, [genreId]);

  // Filmleri çek
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const results = await getMoviesByGenre(genreId, pageParam, "popularity.desc");
        if (ignore) return;
        setMovies(results || []);
      } catch (e) {
        if (!ignore) setErr(e.message || "Failed to fetch movies.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [genreId, pageParam]);

  const handlePage = (delta) => {
    const next = Math.max(1, pageParam + delta);
    setSearchParams({ page: String(next) });
  };

  return (
    <section className="genre-movies-page">
      <div className="breadcrumb">
        <Link to="/genres" className="crumb">Genres</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{genreName}</span>
      </div>

      <h2 className="page-title">{genreName} Movies</h2>

      {loading && <p className="muted">Loading…</p>}
      {err && <p className="error">Error: {err}</p>}
      {!loading && !err && movies.length === 0 && <p className="muted">No movies found.</p>}

      <div className="movie-grid">
        {movies.map((m) => (
          <MovieTile key={m.id} movie={m} />
        ))}
      </div>

      {!loading && !err && movies.length > 0 && (
        <div className="pager">
          <button className="pager-btn" onClick={() => handlePage(-1)} disabled={pageParam <= 1}>← Prev</button>
          <span className="pager-info">Page {pageParam}</span>
          <button className="pager-btn" onClick={() => handlePage(1)}>Next →</button>
        </div>
      )}
    </section>
  );
}

function MovieTile({ movie }) {
  const poster = useMemo(() => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : "https://placehold.co/342x513?text=No+Image";
  }, [movie.poster_path]);

  return (
    <article className="movie-card">
      <img className="movie-poster" src={poster} alt={movie.title} />
      <div className="movie-meta">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-sub">⭐ {movie.vote_average?.toFixed?.(1) ?? "—"} · {movie.release_date || "—"}</p>
      </div>
    </article>
  );
}
