require("dotenv").config();

var fs = require("fs");
var axios = require("axios");
var spotifyRequire = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");

var spotify = new spotifyRequire(keys.spotify);

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

const concertSearch = (query) => {
    var bandsInTownURL = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
    axios.get(bandsInTownURL)
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var date = response.data[i].datetime.replace(/T.*/g, "");
                var location = (response.data[i].venue.region != "") ? response.data[i].venue.city + ", " + response.data[i].venue.region : response.data[i].venue.city;
                console.log(`
                ${response.data[i].venue.name}
                ${location}
                ${moment(date).format("MM/DD/YYYY")}
                `);
            }
        })
        .catch(function () {
            console.log("Please include an artist with your search to get results.");
        });
};

const spotifySearch = (query) => {
    var spotifyQuery = (query != "") ? query : "The Sign Ace of Base"
    spotify.search({
        type: 'track',
        query: spotifyQuery
    })
        .then(function (response) {
            var spotifyPrefix = response.tracks.items;
            for (var i = 0; i < spotifyPrefix.length; i++) {
                console.log(`
            Artist(s): ${spotifyPrefix[i].artists[0].name}
            Song: ${spotifyPrefix[i].name}
            Album: ${spotifyPrefix[i].album.name}
            Preview link: ${spotifyPrefix[i].preview_url}
            `)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

const movieSearch = (query) => {
    var movieURL = (query != "") ? "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy" : "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"
    axios.get(movieURL)
        .then(function (response) {
            console.log(`
            Title: ${response.data.Title}
            Year: ${response.data.Year}
            IMDB Rating: ${response.data.Ratings[0].Value}
            Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            `)
        })
        .catch(function (error) {
            console.log(error);
        });
};

const doWhatItSays = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) return;

        command = data.split(",")[0].trim();
        query = data.split(",")[1].trim();

        switchCase();
    });
};

function switchCase() {
    switch (command) {
        case "concert-this":
            concertSearch(query);
            break;

        case "spotify-this-song":
            spotifySearch(query);
            break;

        case "movie-this":
            movieSearch(query);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

switchCase();