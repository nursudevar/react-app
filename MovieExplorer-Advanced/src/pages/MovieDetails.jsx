import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieReviews,
  getSimilarMovies,
  getRecommendations,
} from "../services/api";
import "../styles/MovieDetails.scss";
import noImage from "../images/no-image.svg";

export default function MovieDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  // tabs
  const [tab, setTab] = useState("overview"); // overview | cast | trailers | more

  // 🔧 Refs ayrı ayrı (sonsuz döngü fix)
  const refOverview = useRef(null);
  const refCast = useRef(null);
  const refTrailers = useRef(null);
  const refMore = useRef(null);

  // underline konumu
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // reviews "view more"
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const [d, c, v, rv, s, r] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getMovieReviews(id),
          getSimilarMovies(id),
          getRecommendations(id),
        ]);
        if (!alive) return;
        setDetails(d);
        setCredits(c);
        setVideos((v?.results || []).filter(x => x.site === "YouTube"));
        setReviews(rv?.results || []);
        setSimilar(s?.results || []);
        setRecs(r?.results || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // 🔧 underline ölçümü — sadece tab değiştiğinde
  useEffect(() => {
    const current = {
      overview: refOverview,
      cast: refCast,
      trailers: refTrailers,
      more: refMore,
    }[tab]?.current;

    if (!current) return;
    const parent = current.offsetParent;
    const left = current.offsetLeft - (parent?.scrollLeft || 0);
    const width = current.offsetWidth;

    // aynı değer ise setState yapma → gereksiz render ve döngü yok
    setIndicator(prev =>
      prev.left === left && prev.width === width ? prev : { left, width }
    );
  }, [tab]);

  // tabbar scroll’unda ince ayar
  const onTabScroll = (e) => {
    const map = { overview: refOverview, cast: refCast, trailers: refTrailers, more: refMore };
    const current = map[tab]?.current;
    if (!current) return;
    const parent = e.currentTarget;
    const left = current.offsetLeft - parent.scrollLeft;
    const width = current.offsetWidth;

    setIndicator(prev =>
      prev.left === left && prev.width === width ? prev : { left, width }
    );
  };

  const posterWide = useMemo(() => {
    const p = details?.backdrop_path || details?.poster_path;
    return p ? `https://image.tmdb.org/t/p/w1280${p}` : null;
  }, [details]);

  const trailerUrl = useMemo(() => {
    const t = videos.find(x => x.type === "Trailer") || videos[0];
    return t ? `https://www.youtube.com/watch?v=${t.key}` : null;
  }, [videos]);

  // sekme değişince reviews görünümünü resetle
  useEffect(() => { setShowAllReviews(false); }, [tab]);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!details) return <div className="page-error">Film bulunamadı.</div>;

  return (
    <div className="movie-details">
      <div className="poster-hero container">
        {posterWide ? (
          <img className="hero-img" src={posterWide} alt={details.title} />
        ) : (
          <div className="hero-fallback" />
        )}
      </div>

      <div className="header-block container">
        <div className="title-wrap">
          <h1>{details.title}</h1>
          <p className="sub">
            {details.release_date?.slice(0, 4) || "—"} • {details.runtime ? `${Math.floor(details.runtime/60)}h ${details.runtime%60}m` : "—"}
          </p>
          <div className="chips">
            {(details.genres || []).slice(0, 3).map(g => (
              <span className="chip" key={g.id}>{g.name}</span>
            ))}
          </div>
          <p className="overview-line">{details.overview || "Özet bulunamadı."}</p>
          <div className="actions">
            <a
              className={`btn btn-primary ${!trailerUrl ? "disabled" : ""}`}
              href={trailerUrl || "#"}
              target="_blank"
              rel="noreferrer"
            >
              ▶ Play Trailer
            </a>
          </div>
        </div>
      </div>

      <div className="tabbar-wrap">
        <div className="tabbar container" onScroll={onTabScroll}>
          <button
            ref={refOverview}
            className={`tab ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            ref={refCast}
            className={`tab ${tab === "cast" ? "active" : ""}`}
            onClick={() => setTab("cast")}
          >
            Cast & Crew
          </button>
          <button
            ref={refTrailers}
            className={`tab ${tab === "trailers" ? "active" : ""}`}
            onClick={() => setTab("trailers")}
          >
            Trailers
          </button>
          <button
            ref={refMore}
            className={`tab ${tab === "more" ? "active" : ""}`}
            onClick={() => setTab("more")}
          >
            Similar & Recommendations
          </button>

          <span
            className="tab-underline"
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        </div>
        <div className="tabbar-divider" />
      </div>

      <div className="panel container">
        {tab === "overview" && <section aria-hidden />}

        {tab === "cast" && (
          <section>
            <h2>Cast & Crew</h2>
            <ul className="cast-grid">
              {(credits?.cast || []).slice(0, 12).map(p => (
                <li key={p.cast_id || p.credit_id} className="person">
                  <img
                    src={p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : "/avatar.png"}
                    alt={p.name}
                  />
                  <div className="person-meta">
                    <div className="name">{p.name}</div>
                    <div className="role">{p.character}</div>
                  </div>
                </li>
              ))}
              {(credits?.crew || [])
                .filter(x => x.job === "Director")
                .slice(0, 2)
                .map(d => (
                  <li key={d.credit_id} className="person">
                    <img
                      src={d.profile_path ? `https://image.tmdb.org/t/p/w185${d.profile_path}` : "/avatar.png"}
                      alt={d.name}
                    />
                    <div className="person-meta">
                      <div className="name">{d.name}</div>
                      <div className="role">{d.job}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {tab === "trailers" && (
          <section>
            <h2>Trailers</h2>
            {videos.length === 0 && <p className="muted">No trailers found.</p>}
            <div className="video-list">
              {videos.map(v => (
                <a key={v.id} className="video-item" href={`https://www.youtube.com/watch?v=${v.key}`} target="_blank" rel="noreferrer">
                  <img src={`https://img.youtube.com/vi/${v.key}/hqdefault.jpg`} alt={v.name}/>
                  <span>{v.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {tab === "more" && (
          <section className="more-grids">
            <div>
              <h2>Similar</h2>
              <div className="card-row">
                {similar.slice(0, 12).map(m => (
                  <Link to={`/movie/${m.id}`} key={m.id} className="mini-card">
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : noImage} alt={m.title}/>
                    <span>{m.title}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2>Recommendations</h2>
              <div className="card-row">
                {recs.slice(0, 12).map(m => (
                  <Link to={`/movie/${m.id}`} key={m.id} className="mini-card">
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : noImage} alt={m.title}/>
                    <span>{m.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {tab === "overview" && (
        <>
          <div className="details-grid container">
            <h2>Details</h2>
            <div className="grid">
              <div className="row">
                <span className="label">Genre</span>
                <span className="value">{(details.genres || []).map(g => g.name).join(", ") || "—"}</span>
              </div>
              <div className="row">
                <span className="label">Release Date</span>
                <span className="value">{details.release_date || "—"}</span>
              </div>
              <div className="row">
                <span className="label">Runtime</span>
                <span className="value">{details.runtime ? `${Math.floor(details.runtime/60)}h ${details.runtime%60}m` : "—"}</span>
              </div>
              <div className="row">
                <span className="label">Director</span>
                <span className="value">
                  {(credits?.crew || []).filter(p => p.job === "Director").map(p => p.name).join(", ") || "—"}
                </span>
              </div>
              <div className="row">
                <span className="label">Cast</span>
                <span className="value">
                  {(credits?.cast || []).slice(0, 6).map(p => p.name).join(", ") || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="reviews-block container">
            <h2>User Reviews</h2>
            {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
            <ul className="review-list">
              {(showAllReviews ? reviews : reviews.slice(0, 3)).map(r => (
                <li key={r.id} className="review-card">
                  <div className="header">
                    <div className="author">
                      <div className="name">{r.author}</div>
                    
                    </div>
                    <div className="time">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <p className="content">{r.content}</p>
                </li>
              ))}
            </ul>
            {!showAllReviews && reviews.length > 3 && (
              <button className="view-more" onClick={() => setShowAllReviews(true)}>
                View More Reviews
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
