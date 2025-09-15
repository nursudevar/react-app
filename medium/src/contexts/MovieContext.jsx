import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext()


//children is reserved component
//children is anything inside of the component that we rendered

export const movieProvider = ({children})  => {

    const [favorites, setFavorites] =  useState([])

    useEffect(() => {}, [])

    return <MovieContext.Provider>
        {children}
    </MovieContext.Provider>




}