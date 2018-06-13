// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    $$('#movieForm').on('submit', function(e){
        var searchMovie = $$('#movieName').val();
        console.log(searchMovie);
        fetchMovies(searchMovie);
        e.preventDefault();
    });

    function fetchMovies(searchMovie){
        $.ajax({
            method: 'GET',
            url:'http://www.omdbapi.com/?apikey=80fe09c6&s=' + searchMovie
        }).done(function(data){
            var moviesArray = data.Search;
            var output= '';
            $.each( moviesArray, function(index, movie){
                output += `
            <li>
            <a onclick="movieClicked('${movie.imdbID}')" href="movie.html" class="item-link item-content">
            <div class="item-media"> <img src="${movie.Poster}">
            </div>
            
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-title"> ${movie.Title}</div>
            <div class="item-after"> Release  Year: ${movie.Year}</div>
            </div>
            </div>
            </a>
            </li>
            `;

            });
            $$('#movieslist').html(output);

        });
    }

});

function movieClicked(id){
    sessionStorage.setItem('movieId', id);
}

myApp.onPageInit('movie', function (page) {
    var getMovieId = sessionStorage.getItem('movieId');
    getMovie(getMovieId);
})

function getMovie(getMovieId){
    $.ajax({
        method: 'GET',
        url:'http://www.omdbapi.com/?apikey=80fe09c6&i=' + getMovieId
        }).done(function(movie){
        var movieDetails = `
     <div class="card">
          <div class="card-header">${movie.Title}</div>
          <div class="card-content">
          <div class="card-content-inner">
          <img src="${movie.Poster}">    
            <ul class="tableMovie">
      <li><strong>Genre:</strong> ${movie.Genre}</li>
      <li><strong>Released:</strong> ${movie.Released}</li>
      <li><strong>Runtime:</strong> ${movie.Runtime}</li>
      <li><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
      <li><strong>IMDB Votes:</strong> ${movie.imdbVotes}</li>
      <li><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
            </div>
          </div>
          <div class="card-footer"><strong> Director:</strong> ${movie.Director}</div>
        </div>
        `;
        $('#movieDetails').html(movieDetails);
        });

    }
