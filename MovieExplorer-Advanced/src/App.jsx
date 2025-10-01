import { useState } from 'react';
import './styles/App.scss';
import MovieCard from './components/MovieCard';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from './contexts/MovieContext';
import NavBar from './components/NavBar';
import Genres from "./pages/Genres";
import GenreMovies from "./pages/GenreMovies";
import MovieDetails from "./pages/MovieDetails";


function App() {

  return (
   <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/favorites" element={<Favorites />}/>
            <Route path="/genres" element={<Genres />} />
            <Route path="/genre/:genreId" element={<GenreMovies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />


        </Routes>
     </main>
   </MovieProvider>
    
  );
}

export default App;
