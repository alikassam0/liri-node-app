var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
require("dotenv").config();

var keys = require("./keys.js");

//initialize keys for spotify and twitter
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//store input from command line
var task = process.argv[2];
var argNode = process.argv;
var input = ''

for (var i = 3; i < argNode.length; i++) {
  // Build a string with the address.
  input = input + " " + argNode[i]
}

console.log(input)

//function to retreive movie data
function findMovieData(){
	var movieName = input
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body){
  		// If the request is successful
  		if (!error && response.statusCode === 200) {
  			console.log("=========================================")
  			console.log("Movie title: " + JSON.parse(body).Title)
  			console.log("Release year: " + JSON.parse(body).Year)
  			console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
  			console.log("Country: " + JSON.parse(body).Country)
  			console.log("Language: " + JSON.parse(body).Language)
  			console.log("Plot: " + JSON.parse(body).Plot)
  			console.log("Cast: " + JSON.parse(body).Actors)
  			console.log("=========================================")


  		}

	})
}

//function to retreive spotify data
function spotifySong(){
	spotify.search({ type: 'track', query: input }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  	}
 
console.log("=====================================") 
console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
console.log("Song Name: " + data.tracks.items[0].name);
console.log("Sample URL: " + data.tracks.items[0].artists[0].external_urls.spotify);
console.log("Album: " + data.tracks.items[0].album.name);
console.log("=====================================") 

});
}

//function to read tweets
function readTweets(){
	var params = {screen_name: 'AliKassam0'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		for (var i = 0; i < tweets.length; i++) {
    			console.log("===============================")
       			console.log("Posted: " + tweets[i].created_at);	
       			if(tweets[i].quoted_status) {
       				console.log("Tweet: " + tweets[i].quoted_status.text);	
       			} else {
       				console.log("Tweet: " + tweets[i].text);
       			}
       			
       			console.log("================================")
    		}
    	}
	});
}

//function to doRandom
function doRandom(){
	var fs = require("fs")

	fs.readFile("random.txt", "utf8", function(error, data){

	if (error) {
		return console.log(error)
	}

	console.log(data);
	var dataArr = data.split(",")	

	input = dataArr[1];
	spotifySong();

	})	
}

//determine which task to run
switch (task) {
	case 'my-tweets':
		readTweets();
		break;
	case 'spotify-this-song': 
		spotifySong();
		break;
	case 'movie-this':
		findMovieData();
		break
	case 'do-what-it-says':
		doRandom();
		break
}




