if (window.document.documentMode) {
  alert("internet explorer not allowed.");
  location.href = 'https://www.google.com/chrome/downloads/';
}

var allSongsList;
var albumTitles = [];
var playlists = [];
var selectedPlaylist;
var currentPlaylist;
var newestPlaylist = {
      date: new Date("2002-03-28"),
      location: 0
    };
var currentHowlID = "holderVal";
var currentSong;
var currentPlayerVolume = 0.50;
var playlistBeenLoaded;
var playerPlayState = 0;
var wasJustLoading = false;
var songTimerInterval;
var marqueeActiveTimer;
var maxDispChar = 40;

var nowPlayingDisplay = document.getElementById("nowPlayingTitle");
var playStateDisplay = document.getElementById("playState");
var durationTimer = document.getElementById("durationTimer");
var playPauseButton = document.getElementById("playPauseButton");
var viewAllButton = document.getElementById("moreAlbumsButton");
var volumeMuteButton = document.getElementById("volumeButton");

viewAllButton.style.display = "none";

function getSongList(){ //get the aray from api
  $.ajax({
    async: false,
    dataType: "json",
    url: "/php/getMusicArrays.php",
    success: function(data){
      allSongsList = data;
      return data;
    }
  });
}

//****** SET UP TEMP OUTPUT ***********************
/*
var tempOutput = document.getElementById("tempOutput");
tempOutput.innerHTML += "hi<br>";
*/
//******************************************************

//******* Volume SLIDER ************************************

var volumeSlider = document.getElementById("volumeSlider");
//var volumeDisplay = document.getElementById("volumeDisplay");
//volumeDisplay.innerHTML = volumeSlider.value / 10; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
volumeSlider.oninput = function() {
  if (playerIsMuted){
    playerIsMuted = false;
    volumeMuteButton.src = "assets/volume.png";
  }

  var formattedValue = (this.value) / 1000;
  //volumeDisplay.innerHTML = Math.floor(this.value / 10);
  updateVolume(formattedValue);
}

var playerIsMuted = false;
var lastVolumeSet = 0.50;

function playerMuteVolume() {
  if (playerIsMuted){
    sliderValue= lastVolumeSet * 1000;
    volumeSlider.value = sliderValue;
    updateVolume(lastVolumeSet);
    volumeMuteButton.src = "assets/volume.png";
    playerIsMuted = false;
  }

  else {
    lastVolumeSet = currentPlayerVolume;
    updateVolume(0);
    volumeSlider.value = 0;
    volumeMuteButton.src = "assets/mute.png";
    playerIsMuted = true;
  }
}
//****************************************************************

//******* Duration SLIDER *************************************

var durationSlider = document.getElementById("durationSlider");

durationSlider.oninput = function() {
  if(currentPlaylist.playlist[currentSong].howl.state() === "loaded"){
    var currentSongDuration = currentPlaylist.playlist[currentSong].duration;
    var newSongDuration = durationSlider.value / 1000;
    newSongDuration = Math.floor(newSongDuration * currentSongDuration);

    currentPlaylist.playlist[currentSong].howl.seek(newSongDuration);
    playerRefreshTimer();
  }

  else{
    this.value = 0;
  }
}

//****************************************************************

//helper functions

function formatDate(date){
  var year = date.slice(2,4);
  var day = date.slice(8,10);
  var month = date.slice(5,7);

  var returnDate = month + "." + day + "." + year;
  return returnDate;
}

function DispSecondsToMinutes(valInSeconds){
  valInSeconds = Math.floor(valInSeconds);
  var minutes = Math.floor(valInSeconds / 60);
  var seconds = valInSeconds - minutes * 60;

  if (minutes <= 9){
    minutes = "0" + minutes.toString();
  }

  else {
    minutes = minutes.toString();
  }

  if (seconds <= 9){
    seconds = "0" + seconds.toString();
  }

  else {
    seconds = seconds.toString();
  }

  var minutesSeconds = minutes.toString() + ":" + seconds;
  return minutesSeconds;
}

function findMaxDispChar(){
  var nowPlayingHolder = document.getElementById("nowPlayingTitle");
  maxDispChar = Math.floor(nowPlayingHolder.offsetWidth / 11.175);
}

////////////////////


function updateNowPlaying(songNum){ //updates the "now playing" song in the html. will need to be changed later when the html has been fully developed
  findMaxDispChar();

  var currentSongChar = songNum + 1;

  var title = currentSongChar.toString() + ". " + currentPlaylist.playlist[songNum].title;
  if (title.length < maxDispChar){

    if (marqueeActiveTimer){
      clearInterval(marqueeActiveTimer);
    }
    nowPlayingDisplay.innerHTML = title;
  }

  else {
    if (marqueeActiveTimer){
      clearInterval(marqueeActiveTimer);
    }

    var localTitle = title + " - ";

    nowPlayingDisplay.innerHTML = localTitle.substr(0,maxDispChar);


    marqueeActiveTimer = setInterval(function(){
      localTitle = localTitle.substr(1) + localTitle.substr(0, 1);
      nowPlayingDisplay.innerHTML = localTitle.substr(0,maxDispChar);
    }, 250);
  }

  if (currentPlaylist.playlist[songNum].albumImagePath == null){
    albumCoverDisplay.src = currentPlaylist.coverImage;
  }

  else{
    albumCoverDisplay.src = currentPlaylist.playlist[songNum].albumImagePath;
  }

  if (currentPlaylist.playlist[songNum].trackNumber == null){
    let formattedDate = currentPlaylist.playlist[songNum].releaseDate;
    formattedDate = formatDate(formattedDate);
    formattedDate = "<p>released on " + formattedDate + ".</p>";

    document.getElementById("releaseDateBox").innerHTML = formattedDate;
  }

  document.getElementById("descriptionBox").innerHTML = currentPlaylist.playlist[songNum].description;
  document.getElementById("lyricsBox").innerHTML = currentPlaylist.playlist[songNum].lyrics;

  frontendUpdateNowPlaying(songNum);
}

function updatePlayState(){
  //playStateDisplay.innerHTML = playerPlayState;
  var littlePlayButton = document.getElementById("littlePlayButton");
  
  if (playerPlayState == 1){
    playPauseButton.src = "assets/pause.png";
    littlePlayButton.src = "assets/songpause.png";
  }

  else {
    playPauseButton.src = "assets/play.png";
    littlePlayButton.src = "assets/songplay.png";
  }

}

function getAlbumList(){ //gets a list of all the album from the master song list and stores them in the albumTitles array.
  for(var i = 0; i < allSongsList.length; i++){
    if (albumTitles.includes(allSongsList[i].album)){
      continue;
    }
    else {
      albumTitles.push(allSongsList[i].album);
    }
  }
}

function buildAlbumPlaylists(){ //build the playlist objects that are able to be passed to the player controls.
  getAlbumList(); //start by getting the possible albums.

  for (var i = 0; i < albumTitles.length; i++){ //iterate through all the album titles and make a playlistObj for each one.
    var tempPlaylistObj = {
      playlistName: albumTitles[i],
      playlist: []
    };

    for (var j = 0; j < allSongsList.length; j++){ //add all of the items that are apart of that album into the playlist array for each playlist. 
      //don't worry about sorting, that got dealt with in the mysql server
      if (allSongsList[j].album == albumTitles[i]){
        tempPlaylistObj.playlist.push(allSongsList[j]);
      }
    }

    tempPlaylistObj.releaseDate = new Date(tempPlaylistObj.playlist[0].releaseDate); //store the release date in a Date object so we manipulate it
    tempPlaylistObj.unformattedReleaseDate = tempPlaylistObj.playlist[0].releaseDate;

    if (newestPlaylist.date < tempPlaylistObj.releaseDate){ //go through and try to find the newest playlist location and date. part of the bigger loop.
      newestPlaylist.location = i;
      newestPlaylist.date = tempPlaylistObj.releaseDate;
    }

    //////////////////////////////////

    tempPlaylistObj.coverImage = "assets/" + ((tempPlaylistObj.playlistName.replace(/\s/g, '')).toLowerCase()).replace(/[^a-zA-Z0-9 ]/g, '') + ".png"; //add the cover to the object.

    //so, naming album cover image convention is as follows:
    //all lowercase no symbols version of the album name as it is entered into the database.
    //////////////////////////////////

    playlists.push(tempPlaylistObj); //add it to the end.
  }

  playlists.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return b.releaseDate - a.releaseDate;
  });
}

function loadPlaylistToPlayer(userPlaylist){

  if (playlistBeenLoaded == 1){ //if a playlist has been loaded, go ahead and reset the state just in case.
    if (playerPlayState){
      playerPlayPause(); //and also pause it if its playing.
    }
    playerResetState();
    playerDeloadAll();
  }

  for (var i = 0; i < playlists.length; i++){ //go through each playlist...
    if (playlists[i].playlistName == userPlaylist){ //look for the one desired and then...
      selectedPlaylist = i;
      break;
    }
  }

  currentPlaylist = playlists[selectedPlaylist];//when its found store it.


  if (selectedPlaylist == null){ //if it's null, pullout and pass an error message to the console.
    return;
  }

  currentSong = 0; //set current song as the first one in the list.
  updateNowPlaying(currentSong);//go ahead and put the title of the first song in the player.
  playerLoadInitTimer(); //load an initial timer for the song at zero.

  //for sure gonna load the first howl song
  currentPlaylist.playlist[0].howl = new Howl({
    src: [currentPlaylist.playlist[currentSong].songPath],
    volume: currentPlayerVolume,
    onend: function(){
      playerSeekNext();
      this.unload();
    }
  });

  //if there is more than one song, load them all
  if (currentPlaylist.playlist.length > 1){
    currentPlaylist.playlist[1].howl = new Howl({
      src: [currentPlaylist.playlist[currentSong + 1].songPath],
      volume: currentPlayerVolume,
      onend: function(){
        playerSeekNext();
        this.unload();
      }
    });
  }

  frontendBuildIndexByPlaylistIndex(selectedPlaylist);
  frontendBuildAlbumIndex();
  playlistBeenLoaded = 1; //yay! player is ready!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function updateVolume(newVolume){
  currentPlayerVolume = newVolume; //change the volume on it.
  Howler.volume(newVolume);

  if (playerGetState()){
    currentPlaylist.playlist[currentSong].howl.volume(newVolume); //if somethings loaded, change the exact volume on it too.
  }
}

function playerResetState(){
  currentPlaylist.playlist[currentSong].howl.stop(); //stop whatevers playing
  playerPlayState = 0; //set the play value to zero
  currentHowlID = "holderVal"; //forget the howl id
}

function playerGetState(){
  if (currentHowlID !== "holderVal"){
    return true;
  }

  else {
    return false;
  }
}

function ifPlayerPlayingPlay(){
  if (playerPlayState == 1){
    setTimeout(playerPlayPause, 250);
  }
}

var loadingTimer;

function playerPlayPause(){

  const isSongLoaded = currentPlaylist.playlist[currentSong].howl.state(); //check if the howl is loaded

  if (loadingTimer){
    clearTimeout(loadingTimer);
  }

  if (isSongLoaded === "unloaded"){
    currentPlaylist.playlist[currentSong].howl.load();
  }

  if (isSongLoaded === "loaded"){ //if its loaded, run the play pause routine.

    if (playerPlayState === 0 && currentHowlID === "holderVal"){ //if its not playing and theres no playing song
      currentHowlID = currentPlaylist.playlist[currentSong].howl.play(); //go ahead and queue up the "current song"
      //currentPlaylist.playlist[currentSong].howl.play(currentHowlID); //play it.
      playerStartStopTimer();
      playerPlayState = 1; //update
    }

    else if (playerPlayState == 0){ //if its just paused.
      //play it
      currentPlaylist.playlist[currentSong].howl.play(currentHowlID);
      playerRefreshTimer();
      playerStartStopTimer();
      playerPlayState = 1;
    }

    else { //if its playing
      // pause it
      currentPlaylist.playlist[currentSong].howl.pause(currentHowlID);
      playerStartStopTimer();
      playerPlayState = 0;
    }

    updatePlayState();
  }

  else { //if not, wait a second and try again.
      if (playPauseButton.src != "assets/loading.gif"){
        playPauseButton.src = "assets/loading.gif";
        littlePlayButton.src = "assets/songloading.gif";
      }
      playerResetState();
      loadingTimer = setTimeout(playerPlayPause, 500);
  }
}

function playerStartStopTimer(){
  songDuration = currentPlaylist.playlist[currentSong].duration;
  songSeek = 0;

  if (playerPlayState == 1){
    clearInterval(songTimerInterval);
  }

  else {
    songTimerInterval = 
      setInterval(function() {
        songSeek = currentPlaylist.playlist[currentSong].howl.seek();
        currentTimerStatus = DispSecondsToMinutes(songSeek) + " / " + DispSecondsToMinutes(songDuration);
        durationTimer.innerHTML = currentTimerStatus;
        durationSlider.value = (songSeek / songDuration) * 1000;
      }, 500);
  }
}

function playerKillTimer(){
  if (songTimerInterval){
    clearInterval(songTimerInterval);
    durationSlider.value = 0;
  }
}

function playerLoadInitTimer(){
  playerKillTimer();
  songDuration = DispSecondsToMinutes(currentPlaylist.playlist[currentSong].duration);
  durationTimer.innerHTML = "00:00 / " + songDuration;
  durationSlider.value = 0;
}

function playerRefreshTimer(){
  songDuration = currentPlaylist.playlist[currentSong].duration;
  songSeek = currentPlaylist.playlist[currentSong].howl.seek();
  sliderRatio = (songSeek / songDuration) * 1000;

  durationSlider.value = sliderRatio;

  currentTimerStatus = DispSecondsToMinutes(songSeek) + " / " + DispSecondsToMinutes(songDuration);
  durationTimer.innerHTML = currentTimerStatus;
}

function playerSeekNext(){
  playerResetState();
  playerDeloadCurrentSong();
  currentSong++;

  if (playerPlayState){
    playerPlayPause();
  }

  if ((currentSong) < playlists[selectedPlaylist].playlist.length){
    updateNowPlaying(currentSong);

    if (!((currentSong + 1) == playlists[selectedPlaylist].playlist.length )){
      currentPlaylist.playlist[currentSong + 1].howl = new Howl({
        src: [currentPlaylist.playlist[currentSong + 1].songPath],
        volume: currentPlayerVolume,
        onend: function(){
          playerSeekNext();
          this.unload();
        }
      });
    }

    playerKillTimer();
    playerLoadInitTimer();

    playerPlayPause();
  }

  else {
    currentSong = 0;

    playerDeloadAll();
    updateNowPlaying(currentSong);
    frontendUpdateNowPlaying(currentSong);
    playerKillTimer();
    playerLoadInitTimer();
    playerResetState();
    loadPlaylistToPlayer(playlists[selectedPlaylist].playlistName);
    updatePlayState();
  }

  updateVolume(currentPlayerVolume);
}

function playerSeekLast(){
  playerResetState();
  playerDeloadCurrentSong();
  currentSong--;

  if (playerPlayState){
    playerPlayPause();
  }

  if ((currentSong) >= 0){
    updateNowPlaying(currentSong);

    if (!((currentSong - 1) == 0)){
      currentPlaylist.playlist[currentSong + 1].howl = new Howl({
        src: [currentPlaylist.playlist[currentSong + 1].songPath],
        volume: currentPlayerVolume,
        onend: function(){
          playerSeekNext();
        }
      });
    }

    playerKillTimer();
    playerLoadInitTimer();

    playerPlayPause();
  }

  else {
    currentSong = 0;

    playerDeloadAll();
    updateNowPlaying(currentSong);
    frontendUpdateNowPlaying(currentSong);
    playerResetState();
    playerKillTimer();
    playerLoadInitTimer();
    loadPlaylistToPlayer(playlists[selectedPlaylist].playlistName);
    updatePlayState();
  }

  updateVolume(currentPlayerVolume);
}

var didweupdatenowplaying = false;

function playerLoadSong(songIndex){

  if (loadingTimer){
    clearTimeout(loadingTimer);
  }

  updateNowPlaying(songIndex);


  if (playerGetState()){
    playerPlayPause();
    playerDeloadCurrentSong();
    playerResetState();
  }

  if (!(currentPlaylist.playlist[songIndex].howl)){
    currentPlaylist.playlist[songIndex].howl = new Howl({
      src: [currentPlaylist.playlist[songIndex].songPath],
      volume: currentPlayerVolume,
      onend: function(){
        playerSeekNext();
        this.unload();
      }
    });
  }

  const isSongLoaded = currentPlaylist.playlist[songIndex].howl.state(); //check if the howl is loaded

  if (isSongLoaded === "unloaded"){
    currentPlaylist.playlist[songIndex].howl.load();
    playPauseButton.src = "loading.gif";
    littlePlayButton.src = "songloading.gif";
  }

  if (isSongLoaded === "loaded"){ //if its loaded, run the play pause routine.

    if (songIndex < currentPlaylist.playlist.length && currentSong != songIndex){
      playerResetState();

      if (playerPlayState){
        playerPlayPause();
      }

      currentSong = songIndex;

      currentPlaylist.playlist[currentSong].howl = new Howl({
        src: [currentPlaylist.playlist[currentSong].songPath],
        volume: currentPlayerVolume,
        onend: function(){
          playerSeekNext();
          this.unload();
        }
      });

      if (!((currentSong + 1) == playlists[selectedPlaylist].playlist.length )){
        currentPlaylist.playlist[currentSong + 1].howl = new Howl({
          src: [currentPlaylist.playlist[currentSong + 1].songPath],
          volume: currentPlayerVolume,
          onend: function(){
            playerSeekNext();
            this.unload();
          }
        });
      }

      playerKillTimer();
      playerLoadInitTimer();

      playerPlayPause();
    }

    else {
      if (!playerGetState()){
        playerPlayPause();
      }
    }
    didweupdatenowplaying = false;
  }

  else {
    if (playPauseButton.src != "assets/loading.gif"){
      playPauseButton.src = "assets/loading.gif";
      littlePlayButton.src = "assets/songloading.gif";
    }
    loadingTimer = setTimeout(function() {playerLoadSong(songIndex) }, 500);
  }
}

function playerLoadInitSong(songIndex){
  currentSong = songIndex;
  updateNowPlaying(currentSong);
  playerLoadInitTimer();

  currentPlaylist.playlist[songIndex].howl = new Howl({
    src: [currentPlaylist.playlist[currentSong].songPath],
    volume: currentPlayerVolume,
    onend: function(){
      playerSeekNext();
      this.unload();
    }
  });

  if (currentPlaylist.playlist[currentSong + 1]){
    currentPlaylist.playlist[currentSong + 1].howl = new Howl({
      src: [currentPlaylist.playlist[currentSong + 1].songPath],
      volume: currentPlayerVolume,
      onend: function(){
        playerSeekNext();
        this.unload();
      }
    });
  }
}

function playerDeloadCurrentSong(){
  currentPlaylist.playlist[currentSong].howl.unload();
}

function playerDeloadAll(){
  Howler.unload();

  cancelAnimationFrame(animationFrameID);

  analyser = Howler.ctx.createAnalyser();
  Howler.masterGain.connect(analyser);

  animate();
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var IDToPlay;

function hasSongIDParam(){ //returns if a valid numerical song ID is in the url search bar
  if (urlParams.has('songID')){
    let potentialSongID = parseInt(urlParams.get('songID'));
    
    if (Number.isInteger(potentialSongID)){
      IDToPlay = potentialSongID;
      return true;
    }

    else {
      return false;
    }
    
  }

  else {
    return false;
  }

}

window.addEventListener('keydown', (e) => {  
  if (e.keyCode === 32 && e.target === document.body) {  
    e.preventDefault();  
  }  
});

document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    playerPlayPause();
  }
}

function normalLoadRoutine(){
  loadPlaylistToPlayer(playlists[0].playlistName);
  updatePlayState();
  frontendUpdateNowPlaying(currentSong);
}

//RUN STARTING HERE

getSongList();

buildAlbumPlaylists();


if (hasSongIDParam()){

  var songOfInterest;

  for (var i = 0; i < allSongsList.length; i++){
    if (IDToPlay == allSongsList[i].id){
      songOfInterest = allSongsList[i];
    }
  }

  if (!songOfInterest){
    normalLoadRoutine();
  }

  else{
    loadPlaylistToPlayer(songOfInterest.album);
    updatePlayState();
    frontendUpdateNowPlaying(currentSong);

    var loadByInt;

    for (var i = 0; i < currentPlaylist.playlist.length; i++){
      if (songOfInterest.id == currentPlaylist.playlist[i].id) {
        loadByInt = i;
        break;
      }
    }

    playerLoadInitSong(loadByInt);
  }
}

else {
  normalLoadRoutine();
}


Howler.volume(0.5);