import { useState } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';


function App() {


  return (
   <>
   <MovieCard movie={{title:"Tims's Film", release_date:"2001"}}/>
   </>
  )
}

export default App
