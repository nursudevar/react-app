import {createContext, useState, useContext, useEffect} from "react"

//CreateContext is a function defined in the react library.
//We use it to share states within different pages and components. (Example: Favorites)


const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

//this line defines hook. It calls useState hook. It pulls values inside of MovieContext.


//children is reserved component
//children is anything inside of the component that we rendered

export const movieProvider = ({children})  => {

    const [favorites, setFavorites] =  useState([])

    useEffect(() => {
    
        const storedFavs = localStorage.getItem("favorites")
 
        if(storedFavs) setFavorites(JSON.parse(storedFavs)) 
            //We get movies in a list and this converts to JSON String
            //Because local storage only store in JSON String
            //When we wanna read it, we convert to js array with JSON.parse

    }, [])


    //What we do here is, every time favorites changes, we update local storage. 
    //That is why we change it to string (To store in local storage)
    //This use effect only runs when favorites is changed.
    useEffect(() => {

        localStorage.setItem('favorites', JSON.stringify(favorites))

    } , [favorites])


    //the three dot means: copy all elements.
    //Here we do, copy all elements on prev and then add movie. Through this, we make a list with new favorites.
    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }


    //Here, if the ID doesn't equal to ID that we want (movieId), It removes them from favorites list.
    //We use filter to strain the elements.
    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.Id !== movieId))
    }

    const isFavorite = (movideId) => {

        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>




}