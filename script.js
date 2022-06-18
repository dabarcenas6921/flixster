const searchFormElement = document.querySelector(".search-form");
const submitButtonElement = document.getElementById("submit-button");
const moviesContainerElement = document.querySelector(".movies-grid");
const showMoreElement = document.querySelector("#load-more-movies-btn");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const movieInformationElement = document.querySelector(".movie-information");
const KEY = "457975d68f1ffc79f2d2fc03153e3600";
var tempSearched;
var searchedTerm;
var pageNumber = 1;
var typeOfSearchTerm;
var alreadySearched = false;
var movieKey;

async function getResults(searchedItem) {
    typeOfSearchTerm = "searchedMovie"
    let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=457975d68f1ffc79f2d2fc03153e3600&language=en-US&query=${searchedItem}&page=${pageNumber}&include_adult=false`;
    let response = await fetch(apiUrl);
    let jsonResponse = await response.json();
    let data = jsonResponse.results;
    console.log(data);
    displayResults(data, typeOfSearchTerm);
}


function handleFormSubmit() {

    searchFormElement.addEventListener("submit", async (evt) => {

        tempSearched = evt.target.search.value;

        if (tempSearched) {
            moviesContainerElement.innerHTML = "";

            pageNumber = 1;

            alreadySearched = false;

            evt.preventDefault();

            searchedTerm = tempSearched.replace(/ /g, "+");

            console.log("Searched term is:", searchedTerm) //For debugging

            evt.target.search.value = ""; //Clears search bar

            getResults(searchedTerm);

        }

        console.log("tempsearched value is ", tempSearched);

    })
}

function displayResults(responseData, typeOfSearch) {

    if (typeOfSearch == "nowPlaying") {
        //Displays the movies
        responseData.forEach((elem) => {

            console.log("Retrieved movie poster: ", elem.poster_path);

            if (elem.poster_path) {

                moviesContainerElement.innerHTML += `

            <div class="movie-card" onclick="getYoutubeVideos(${JSON.stringify(elem).split('"').join("&quot;")})">
                <img class= "movie-poster" src="https://image.tmdb.org/t/p/w1280${elem.poster_path}" alt="${elem.original_title}"></img>
                <h2 class="movie-title">${elem.original_title}</h2>
                <h3 class="movie-votes">⭐ ${elem.vote_average}</h3>
            </div>
    
            `
                console.log("Success");

            } else {

                moviesContainerElement.innerHTML += `

            <div class="movie-card" onclick="getYoutubeVideos(${JSON.stringify(elem).split('"').join("&quot;")})">
                <img class= "movie-poster" src="no-image.png" alt="${elem.original_title}"></img>
                <h2 class="movie-title">${elem.original_title}</h2>
                <h3 class="movie-votes">⭐ ${elem.vote_average}</h3>
            </div>
    
            `

                console.log("Success");
            }

        })
    } else {
        if (alreadySearched == false) {
            //Small header and a go back button
            moviesContainerElement.innerHTML += `
        <div class="smaller-navbar">
            <h2 id="showing-results">Showing results similar to ${tempSearched}</h2>
            <button id="close-search-btn" onclick="backButton()">Back</button>
        </div>
            `
            alreadySearched = true;
        }


        //Displays the movies
        responseData.forEach((elem) => {

            console.log("Retrieved movie poster: ", elem.poster_path);

            if (elem.poster_path) {

                moviesContainerElement.innerHTML += `

            <div class="movie-card" onclick="getYoutubeVideos(${JSON.stringify(elem).split('"').join("&quot;")})">
                <img class= "movie-poster" src="https://image.tmdb.org/t/p/w1280${elem.poster_path}"></img>
                <h2 class="movie-title">${elem.original_title}</h2>
                <h3 class="movie-votes">⭐ ${elem.vote_average}</h3>
            </div>
    
            `
                console.log("Success");

            } else {

                moviesContainerElement.innerHTML += `

            <div class="movie-card" onclick="getYoutubeVideos(${JSON.stringify(elem).split('"').join("&quot;")})">
                <img class= "movie-poster" src="no-image.png"></img>
                <h2 class="movie-title">${elem.original_title}</h2>
                <h3 class="movie-votes">⭐ ${elem.vote_average}</h3>
            </div>
    
            `
                console.log("Success");
            }

        })
    }

}

function showMore() {

    showMoreElement.addEventListener("click", async (evt) => {
        evt.preventDefault();

        pageNumber++;

        if (searchedTerm) {
            getResults(searchedTerm);
        } else {
            showNowPlaying();
        }

    })


}

async function showNowPlaying() {
    typeOfSearchTerm = "nowPlaying";
    let apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=457975d68f1ffc79f2d2fc03153e3600&language=en-US&page=${pageNumber}`;
    let response = await fetch(apiUrl);
    let jsonResponse = await response.json();
    let data = jsonResponse.results;
    console.log(data);
    displayResults(data, typeOfSearchTerm);

}

async function getYoutubeVideos(movie){

    let apiUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=457975d68f1ffc79f2d2fc03153e3600&language=en-US`;
    let response = await fetch(apiUrl);
    let jsonResponse = await response.json();
    let data = jsonResponse.results;
    movieKey = data[0].key;
    console.log(movieKey);
    toggleModal(movie);
}

function toggleModal(element) {

    movieInformationElement.innerHTML = "";
    console.log("entered toggle")
    
    modal.classList.toggle("show-modal");
    if(movieKey){
        movieInformationElement.innerHTML += `
        <iframe width="480" height="270" src="https://www.youtube.com/embed/${movieKey}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <h1>${element.original_title}</h1>
        <h2>Movie release date: ${element.release_date}</h2>
        <p>${element.overview}</p>
        
        `
    }
    else{
        movieInformationElement.innerHTML += `
        <h1>${element.original_title}</h1>
        <h2>Movie release date: ${element.release_date}</h2>
        <p>${element.overview}</p>
        
        `
    }
   

}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

function backButton() {
    moviesContainerElement.innerHTML = "";
    showNowPlaying();
}

window.onload = (event) => {
    showNowPlaying();
    handleFormSubmit();
    showMore();
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
}