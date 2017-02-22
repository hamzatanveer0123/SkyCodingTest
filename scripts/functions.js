/**
 * Software Engineering Academy – Unattended coding test
 * Created by Hamza Tanveer on 20/02/2017.
 */

var MOODS         = ["Agitated","Calm","Happy","Sad","Tired","WideAwake","Scared","Fearless"];
var selectedMoods = [];
var moodMoviesObj = [];

/*
 * Trigger: When sliders are moved/change value.
 */
$('input[type="range"]').change(function () {

    //if content file is not uploaded
    if(moodMoviesObj.length == 0){
        alert("Please upload content first!");
        resetSliders();
        return;
    }

    var value = $(this).val();

    //if the value is not int i.e is floating
    //that means the slider is in the middle
    //remove the moods of the slider whose
    //thumb is in the middle.
    if(!isInt(value)){
        removeMoodNotSelected($(this));
        if(selectedMoods.length > 0) {
            value = MOODS.indexOf(selectedMoods[0]);
        }
        else {
            setNoContent();
            return;
        }
    }
    findMovies(MOODS[value]);
});

/*
 * Trigger: When user is moving the mouse using slide.
 * If user passes the middle the values are removed to
 * avoid conflict with categories.
 */
$('input[type="range"]').on("mousemove", function () {
    var value = $(this).val();
    if(!isInt(value)){
        removeMoodNotSelected($(this));
    }
});

/*
 * if the value is not int i.e is floating
 * that means the slider is in the middle
 * remove the moods of the slider whose
 * thumb is in the middle.
 */
function removeMoodNotSelected($this) {
    var min = $this.attr("min");
    var max = $this.attr("max");
    var minIndex = selectedMoods.indexOf(MOODS[min]);
    var maxIndex = selectedMoods.indexOf(MOODS[max]);
    if (minIndex > -1) selectedMoods.splice(minIndex, 1);
    if (maxIndex > -1) selectedMoods.splice(maxIndex, 1);
}

/*
 * This function finds the movies according to the selected moods.
 * It checks if multiple moods are selected and then find movies
 * accordingly.
 * @parameter: String moodValue
 */
function findMovies(moodValue) {

    //if mood is in selected MOODS then don't add again.
    if(selectedMoods.indexOf(moodValue) == -1) {
        selectedMoods.push(moodValue);
    }

    //if more than one mood selected than search accordingly.
    if(selectedMoods.length > 1){
        moodValue = selectedMoods.sort().join('+');
    }

    //get movies according to the mood.
    var movies = moodMoviesObj[moodValue];
    if(movies != null) {
        for (var i = 0; i < movies.length; i++) {

            var name  = moodMoviesObj[moodValue][i].name;
            var image = moodMoviesObj[moodValue][i].image;

            $("#movie" + i + "-image").attr("src", image);
            $("#movie" + i + "-text").text(name);
        }
    }
    else {
        alert("No Movies In "+moodValue+" Category!\nPlease try:\nSad + Fearless\nAgitated + Tired");
        setNoContent();
    }
}

/*
 * restore the movie shelf to no content
 */
function setNoContent() {
    $(".movie-image").attr("src","images/static/nocontent-placeholder.png");
    $(".movie-title").text("No Content");
    resetSliders();
    selectedMoods = [];
}

/*
 * reset slider to be in middle
 */
function resetSliders() {
    $('input[type="range"]').val("");
}

/*
 * to check if number is an int or float
 */
function isInt(n) {
    return n % 1 === 0;
}

/*
 * Trigger: when content button is pressed and
 * file is uploaded.
 *
 * Function reads the file and convert the data
 * into XML format and store it in a variable.
 */
$(".upload-content").change(function(event){
    var xmlFile = event.target.files;
    var fileReader = new FileReader();
    fileReader.readAsText(xmlFile[0]);

    fileReader.onload = function() {
        var xml            = new DOMParser().parseFromString(this.result, "text/xml");
        var $xmlMovieList  = $(xml.documentElement);
        processXML($xmlMovieList);
        alert("Content Uploaded!");
    }
});

/*
 * This function reads through the XML and create
 * objects of the movies and store them in the array
 * according the mood listed.
 *
 * This pre processing makes it easy to retrieve
 * data while finding movies according to the mood.
 * @parameter: jQuery Object $xmlMovieList
 */
function processXML($xmlMovieList) {
    $($xmlMovieList).find('programme').each(function(){

        var $movie  = $(this);
        var name    = $movie.find("name").text();
        var image   = $movie.find("image").text();
        var mood    = $movie.find("mood").text();

        var movie = {
            name: name,
            image: image
        };

        var splitMood = mood.split("+");
        if(splitMood.length > 1){
            mood = splitMood.sort().join('+');
        }

        if(moodMoviesObj.indexOf(mood) == -1){
            moodMoviesObj.push(mood);
            moodMoviesObj[mood] = [];
        }
        moodMoviesObj[mood].push(movie);
    });
}