// Navbar hamburger toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("hidden");
}

function closeNavbar() {
  document.getElementById("mobileMenu").classList.add("hidden");
}

//IMDB results display
var $input = document.getElementById("searchBox");
var baseUrl = "https://sg.media-imdb.com/suggests/";
var $result = document.getElementById("result");
var body = document.getElementsByTagName("body");

$input.addEventListener("keyup", function () {
  //clearing blank spaces from input
  var cleanInput = $input.value.replace(/\s/g, "");

  // clearing result div if the input box is empty
  if (cleanInput.length === 0) {
    $result.innerHTML = "";
    $result.style.display = "none"; // Hide the result div
  }

  if (cleanInput.length > 0) {
    var queryUrl = `${
      baseUrl + cleanInput[0].toLowerCase()
    }/${cleanInput.toLowerCase()}.json`;
    $.ajax({
      _url: queryUrl,
      get url() {
        return this._url;
      },
      set url(value) {
        this._url = value;
      },
      _dataType: "jsonp",
      get dataType() {
        return this._dataType;
      },
      set dataType(value) {
        this._dataType = value;
      },
      _cache: true,
      get cache() {
        return this._cache;
      },
      set cache(value) {
        this._cache = value;
      },
      _jsonp: false,
      get jsonp() {
        return this._jsonp;
      },
      set jsonp(value) {
        this._jsonp = value;
      },
      _jsonpCallback: "imdb$" + cleanInput.toLowerCase(),
      get jsonpCallback() {
        return this._jsonpCallback;
      },
      set jsonpCallback(value) {
        this._jsonpCallback = value;
      },
    }).done(function (result) {
      //clearing result div if there is a valid response
      if (result.d.length > 0) {
        $result.innerHTML = "";
        $result.style.display = "block";
      } else {
        $result.style.display = "none"; // Hide the result div if there are no search results
      }

      for (var i = 0; i < result.d.length; i++) {
        var category = result.d[i].id.slice(0, 2);

        if (category === "tt" || category === "nm") {
          //row for displaying one result
          var resultRow = document.createElement("a");
          resultRow.setAttribute("class", "resultRow");
          var destinationUrl;

          if (category === "tt") {
            destinationUrl = "https://www.imdb.com/title/" + result.d[i].id;
          } else {
            destinationUrl = "https://www.imdb.com/name/" + result.d[i].id;
          }

          resultRow.setAttribute("href", destinationUrl);
          resultRow.setAttribute("target", "_blank");

          //creating and setting poster
          var poster = document.createElement("img");
          poster.setAttribute("class", "poster");

          if (result.d[i].i) {
            var imdbPoster = result.d[i].i[0];
            imdbPoster = imdbPoster.replace(
              "._V1_.jpg",
              "._V1._SX40_CR0,0,40,54_.jpg"
            );
            var posterUrl =
              "https://i.embed.ly/1/display/resize?key=798c38fecaca11e0ba1a4040d3dc5c07&url=" +
              imdbPoster +
              "&height=54&width=40";
            poster.setAttribute("src", posterUrl);
          }

          //creating and setting description
          var description = document.createElement("div");
          description.setAttribute("class", "description");
          var name = document.createElement("h4");
          var snippet = document.createElement("h5");

          if (category === "tt" && result.d[i].y) {
            name.innerHTML = result.d[i].l + " (" + result.d[i].y + ")";
          } else {
            name.innerHTML = result.d[i].l;
          }
          snippet.innerHTML = result.d[i].s;

          $(description).append(name);
          $(description).append(snippet);

          $(resultRow).append(poster);
          $(resultRow).append(description);
          $("#result").append(resultRow);
        }
      }
    });
  }
});

// Get the search input element
const searchInput = document.getElementById("searchBox");

// Get the search results container element
const searchResults = document.getElementById("result");

// Add an event listener to the search input
searchInput.addEventListener("input", () => {
  // Check if the search input value is empty
  if (searchInput.value.trim() === "") {
    // Hide the search results container
    searchResults.style.display = "none";
  } else {
    // Show the search results container
    searchResults.style.display = "block";
  }
});

// Add a click event listener to the document
document.addEventListener("click", (event) => {
  // Check if the click event target is outside the search results container
  if (!searchResults.contains(event.target)) {
    // Hide the search results container
    searchResults.style.display = "none";
  }
});

// API key and URL for The Movie Database (TMDb)
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "11d709982d73ca3b61226bf899b78a2b";
const API_URL = "https://api.themoviedb.org/3";

// DOM elements

const searchButton = document.querySelector("#search");
const input = document.querySelector("#inputMovie");
const movieShow = document.querySelector("#results-nowshowing");
const moviesContainer = document.querySelector("#movie-container");


// Creates a full API URL using the given path
function createURL(path) {
  return `${API_URL}${path}?api_key=${API_KEY}`;
}

// Sends a request to the TMDb API with the given URL and handles the response
function requestMovies(url, onComplete) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      onComplete(data);
    });
}

function movieSegment(movies, sectionId) {
  return movies
    .filter((movie) => movie.poster_path) // Filter out movies without poster_path
    .map(
      (movie) => `
      <img
        src="${IMG_URL + movie.poster_path}"
        alt="${movie.title}"
        class="h-80 w-56 cursor-pointer hover:scale-105 transition-all"
        onclick="toggleDetails(event, ${movie.id}, '${sectionId}')"
      />
      <div class="flex-none">
        <div class="relative">
          <div class="flex">
            <div id="details-${sectionId}-${
        movie.id
      }" class="hidden text-white w-96 p-4">
              <span class="text-2xl font-bold h-16 flex items-center">${
                movie.title
              }
              </span>
              <hr>
              <div class="text-md my-2">
                <span class="font-bold"><i class="fa-solid fa-calendar-days fill-black"></i>&nbsp; ${
                  movie.release_date
                }&nbsp;</span>
                <span class="text-md">${
                  movie.vote_average > 1
                    ? `<i class="fa-solid fa-star"></i>&nbsp; ${movie.vote_average}/10`
                    : ""
                }</span>
<i id="details-${sectionId}-${
        movie.id
      }" class="favorite-icon far fa-heart p-2 cursor-pointer tooltip" onclick="toggleFavorite(${JSON.stringify(
        movie
      )})">
  <span class="tooltiptext font-bold">Add Favourites</span>
</i>

              </div>
              <p class="text-sm text-justify h-40 overflow-y-scroll">
                ${movie.overview}
              </p>
              <button type="button" class="bg-pink-900 cursor-pointer text-white rounded-md px-4 py-2 m-2 hover:bg-rose-950" onclick="displayTrailers(${
                movie.id
              }, '${sectionId}')">TRAILER & CLIPS</button>
              <button type="button" class="bg-pink-900 cursor-pointer text-white rounded-md px-4 py-2 m-2 hover:bg-rose-950" onclick="redirectToIMDb(event, ${
                movie.id
              })">IMDB</button>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");
}


// Retrieves the IMDb ID for a movie using the TMDb API
function getImdbId(movieId, onComplete) {
  const url = createURL(`/movie/${movieId}/external_ids`);
  requestMovies(url, (data) => {
    const imdbId = data.imdb_id;
    onComplete(imdbId);
  });
}

// Redirects to IMDb page for the specified movie ID
function redirectToIMDb(event, movieId) {
  event.stopPropagation();
  getImdbId(movieId, (imdbId) => {
    if (imdbId) {
      const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;
      const newTab = window.open(imdbUrl, "_blank");
      newTab.focus();
    } else {
      console.log("IMDb ID not found for movie ID:", movieId);
    }
  });
}

// Stores a reference to the currently open movie details
let currentDetails = null;

// Toggles the details section for the specified movie ID
function toggleDetails(event, movieId, sectionId) {
  const details = document.getElementById(`details-${sectionId}-${movieId}`);
  if (details) {
    details.classList.toggle("hidden");
    
    // Close the previous details if exists
    if (currentDetails && currentDetails !== details) {
      currentDetails.classList.add("hidden");
    }
    
    // Update the reference to the current details
    currentDetails = details;
  }
}

// Handles the click event on movie images
document.onclick = function (event) {
  const target = event.target;
  
  if (target.tagName.toLowerCase() === "img") {
    const movieId = target.dataset.movieId;
    toggleDetails(event, movieId);
  }
};

// Creates the HTML for a movie container, which includes a title, a section for movie segments, and a content section for displaying videos
function movieContainer(movies, sectionId, title = "") {
  const movieEl = document.createElement("div");
  movieEl.setAttribute("class", "movie");
  
  const moviePattern = `
  <h2>${title}</h2>
  <section class="movie-section">
  ${movieSegment(movies, sectionId)}
  </section>
  `;
  movieEl.innerHTML = moviePattern;
  return movieEl;
}

// Handles the response from a movie search and displays the results in the "now showing" section
function searchMovies(data, title) {
  const movies = data.results;
  const movieBlock = movieContainer(movies, title);
  movieShow.innerHTML = "";
  movieShow.appendChild(movieBlock);
}

// Renders a list of movies in the movies container
function renderMovies(data, title = "", sectionId) {
  const movies = data.results;
  const movieBlock = movieContainer(movies, sectionId, title);
  const section = document.getElementById(sectionId);
  section.innerHTML = ""; // Clear the section content
  section.appendChild(movieBlock);
}

// Fetches movies by search query
function findMovie(value) {
  const path = "/search/movie";
  const url = createURL(path) + `&query=${value}`;
  const title = `Your Search`;
  const sectionId = "search-results";
  requestMovies(url, (data) => renderMovies(data, title, sectionId));
}

// Fetches upcoming movies
function upcomingMovies() {
  const path = "/movie/upcoming";
  const url = createURL(path);
  const title = "UPCOMING MOVIES";
  const sectionId = "upcoming-movies";
  requestMovies(url, (data) => renderMovies(data, title, sectionId));
}

// Fetches popular movies
function trending() {
  const path = "/movie/popular";
  const url = createURL(path);
  const title = "TRENDING NOW";
  const sectionId = "trending-movies";
  requestMovies(url, (data) => renderMovies(data, title, sectionId));
}


// Fetches top-rated movies
function topRated() {
  const path = "/movie/top_rated";
  const url = createURL(path);
  const title = "TOP-RATED MOVIES";
  const sectionId = "top-rated-movies";
  requestMovies(url, (data) => renderMovies(data, title, sectionId));
}


// Fetches now playing movies
function nowPlaying() {
  const path = "/movie/now_playing";
  const url = createURL(path);
  const title = "IN-THEATRES";
  const sectionId = "now-playing-movies";
  requestMovies(url, (data) => renderMovies(data, title, sectionId));
}


// Initial movie search and fetches
findMovie("Avengers");
upcomingMovies();
trending();
topRated();
nowPlaying();

// Handles search button click event
searchButton.onclick = function (e) {
  e.preventDefault();
  const value = input.value.trim();
  
  if (value) {
    movieShow.innerHTML = ""; // Clear previous search results
    findMovie(value);
    input.value = "";
    console.log("Value: ", value);
  }
};

// Perform movie search when Enter key is pressed
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const value = input.value.trim();

    if (value) {
      movieShow.innerHTML = ""; // Clear previous search results
      findMovie(value);
      input.value = "";
    }
  }
});

// Initialize an empty array for favorites
let favorites = []; //USE Object.entries or Object.values to extract the data

// Function to toggle favorite status
function toggleFavorite(movieString) {
  const movie = JSON.parse(movieString);
  const index = favorites.findIndex((favMovie) => favMovie.id === movie.id);
  if (index > -1) {
    // Movie is already in favorites, remove it
    favorites.splice(index, 1);
  } else {
    // Movie is not in favorites, add it
    favorites.push(movie);
  }
  setFavorites(favorites);
}

// Function to retrieve favorites from local storage
function getFavorites() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

// Function to store favorites in local storage
function setFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// change the heart icon to solid and add the items to local storage
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("favorite-icon")) {
      const iconId = target.id;
      const movieString = extractMovieFromIconId(iconId, movies);
      toggleFavorite(movieString);
      target.classList.toggle("fas");
    }
  });
});

// Function to extract movie object from the icon's ID
function extractMovieFromIconId(iconId, movies) {
  const parts = iconId.split("-");
  const movieId = parts[parts.length - 1];
  const movie = movies.find((movie) => movie.id === movieId);
  return JSON.stringify(movie);
}

function updateFavoritesSection() {
  const favorites = getFavorites();
  const favoritesContainer = document.getElementById("favorites-container");
  favoritesContainer.innerHTML = "";
  if (favorites.length === 0) {
    // No favorites, hide the section
    document.getElementById("favorites-section").classList.add("hidden");
  } else {
    // Create favorite movie segments
    const favoriteSegments = movieSegment(favorites, "favorites");
    favoritesContainer.innerHTML = favoriteSegments.join("");
    document.getElementById("favorites-section").classList.remove("hidden");
  }
}

// Call updateFavoritesSection when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  movies = []; // Define and populate the movies array with necessary movie data
  updateFavoritesSection();
});

// Creates an iframe element for embedding YouTube videos
function createIframe(video) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${video.key}`;
  iframe.width = 300;
  iframe.height = 200;
  iframe.allowFullscreen = true;
  return iframe;
}

// Fetches movie trailers and displays them
function displayTrailers(movieId, sectionId) {
  const path = `/movie/${movieId}/videos`;
  const url = createURL(path);
  
  requestMovies(url, (data) => {
    const details = document.getElementById(`details-${sectionId}-${movieId}`);
    if (details) {
      videoTemplate(data, details);
    } else {
      console.log("Details container not found:", `details-${sectionId}-${movieId}`);
    }
  });
}

// Container for trailers
function videoTemplate(data, container) {
  const videos = data.results;
  const videoSection = document.createElement("div");
  videoSection.classList.add("video-section");
  
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "X CLOSE";
  closeButton.addEventListener("click", () => {
    videoSection.remove();
  });
  videoSection.appendChild(closeButton);
  
  const iframeContainer = document.createElement("div");
  videos.forEach((video) => {
    const iframe = createIframe(video);
    iframeContainer.appendChild(iframe);
  });
  
  videoSection.appendChild(iframeContainer);
  
  // Remove the existing video section if it exists in the container
  const existingVideoSection = container.querySelector(".video-section");
  if (existingVideoSection) {
    existingVideoSection.remove();
  }
  container.appendChild(videoSection);
}

// Elements for random quotes section
const quotesEl = document.querySelector("#quotes");
const nextQuoteEl = document.querySelector("#nextQuote");

// Apply Tailwind classes to the elements
quotesEl.classList.add("text-lg", "font-bold", "text-white", "my-4");

// Fetches a random quote from an API and displays it on the page
function quote() {
  fetch("https://api.api-ninjas.com/v1/quotes?category=movies", {
    method: "GET",
    headers: {
      "X-Api-Key": "4AmTehiaKN3T/adJXOG83Q==YFsdIoPitDwwKv7D",
    },
  })
  .then((res) => res.json())
  .then((quote) => {
    let generatedQuote = quote[0].quote;
    let generatedAuthor = quote[0].author;
    quotesEl.innerHTML = `"<i>${generatedQuote}</i>" - ${generatedAuthor}`;
  });
}

// Displays a random quote
quote("");

// Allows user to click the button for the next quote
nextQuoteEl.addEventListener("click", function (event) {
  event.preventDefault();
  quote();
});

// console message
let message =
  "Lights, camera, action! Get ready for a thrilling cinematic experience! 🍿💥\n\nIf you're curious about the magic behind this site, feel free to reach out. We're always eager to hear your suggestions and ideas to make this movie journey even more extraordinary. Remember, in this theater of possibilities, your feedback shines like a shooting star! ✨🎬\n\nAnd as we embark on this adventure together, let me leave you with some iconic movie quotes to ignite your imagination:\n\n'Life is like a box of chocolates; you never know what you're gonna get.' - Forrest Gump\n\nNow, grab your popcorn, sit back, and let the reel of excitement begin! Enjoy the show! 🌟🎥";

console.log("🎥", message);