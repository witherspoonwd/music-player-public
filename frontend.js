function mobileCheck() {
  //let check = false;
  //(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  //return check;

  if (window.innerWidth < 500) {
    return true;
  }

  else {
    return false;
  }
}

var constructingForMobile = mobileCheck();

function frontendBuildHTML(){
  var albumCoverBox = document.createElement("div");
  albumCoverBox.id = "currentAlbumCover";

  var albumCoverImg = document.createElement("img");
  albumCoverImg.id = "currentAlbumCoverIMG";

  albumCoverBox.append(albumCoverImg);


  var desktopAlbumBox = document.getElementById("albumBox");
  var mobileAlbumBox = document.getElementById("indexBox");

  if (constructingForMobile){
    mobileAlbumBox.prepend(albumCoverBox);
  }

  else {
    desktopAlbumBox.prepend(albumCoverBox);
  }
}

frontendBuildHTML();

var albumTitleDisplay = document.getElementById("albumTitle");
var albumReleaseDisplay = document.getElementById("albumReleaseDate");
var albumLengthDisplay = document.getElementById("albumTotalLength");
var albumCoverDisplay = document.getElementById("currentAlbumCoverIMG");

function calcPlaylistTime(playlistIndex){
  var playlistTotals = playlists[playlistIndex].playlist.length;
  var totalTimeInSeconds = Number("0");
  var returnString;
  
  for (var i = 0; i < playlistTotals; i++){
    convertNum = Number(playlists[playlistIndex].playlist[i].duration);
    totalTimeInSeconds = totalTimeInSeconds + convertNum;
  }
  
  var minutes = Math.floor(totalTimeInSeconds / 60);
  
  if (minutes > 60){
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    returnString = hours.toString() + " hr, " + minutes.toString() + " min";
  }

  else {
    var seconds = totalTimeInSeconds % 60;
    returnString = minutes.toString() + " min, " + seconds.toString() + " sec"; 
  }

  return returnString;
}

function frontendBuildIndexByPlaylistIndex(playlistIndex){

  var playlistTotals = playlists[playlistIndex].playlist.length;


  albumTitleDisplay.innerHTML = playlists[playlistIndex].playlistName;

  var formattedDate = playlists[playlistIndex].unformattedReleaseDate;
  formattedDate = formatDate(formattedDate);
  albumReleaseDisplay.innerHTML = formattedDate;

  albumLengthDisplay.innerHTML = calcPlaylistTime(playlistIndex);

  //table stuff:

  var tableDiv = document.getElementById("playlistIndexBox");
  
  while (tableDiv.firstChild){
    tableDiv.removeChild(tableDiv.firstChild);
  }

  var songIndexTable = document.createElement('table');
  songIndexTable.id = "playlistTable";

  for (var i = 0; i < playlistTotals; i++){
    var newTableRow = document.createElement('tr');
    newTableRow.id = i;
    
    var tableSongNum = document.createElement('td');
    tableSongNum.className = "trackNumber";
    tableSongNum.clientWidth = "25px";

    tableSongNum.onclick = function() {
      elementIDAsNum = +this.parentElement.id;

      if (elementIDAsNum == currentSong){
        playerPlayPause();
      }

      else {
        playerLoadSong(elementIDAsNum);
      }

    }
    tableSongNum.onmouseenter = function() {
      if (this.parentElement.id != currentSong){
        this.innerHTML = "<img src='assets/songplay.png'>"
      }
    }

    tableSongNum.onmouseleave = function() {
      if (this.parentElement.id != currentSong){
        this.innerHTML = (+this.parentElement.id + 1).toString() + ".";
      }
    }

    if(i == 0){
      tableSongNum.innerHTML = "<img id='littlePlayButton' src='assets/songplay.png'>";
    }

    else {
    var tempNum = i+1;
    tempNum = tempNum.toString() + ".";
    tableSongNum.innerText = tempNum;
    }

    var tableTitleLength = document.createElement('td');
    tableTitleLength.className = "titleLength";

    var currentHref = window.location.href.split('?')[0];

    var songIdByIndex = playlists[playlistIndex].playlist[i].id;

    var songTitleSpan = document.createElement('a');
    //songTitleSpan.href = "javascript:playerLoadSong(" + i + ")";
    songTitleSpan.href = currentHref + "?songID=" + songIdByIndex;
    const conI = i;
    songTitleSpan.onclick = function () {
      playerLoadSong(conI);
      return false;
    }
    songTitleSpan.className = "songTitle";
    songTitleSpan.innerText = playlists[playlistIndex].playlist[i].title;



    var songLengthSpan = document.createElement('span');
    songLengthSpan.className = "songLength";
    songLengthSpan.innerHTML = "&nbsp" + DispSecondsToMinutes(playlists[playlistIndex].playlist[i].duration);

    tableTitleLength.append(songTitleSpan, songLengthSpan);

    var tableDownloadButton = document.createElement('td');
    tableDownloadButton.className = "downloadButton";
    tableDownloadButton.innerHTML = "<img src='assets/download.png'>";

    const currentSongIndexConst = i;

    tableDownloadButton.onclick = function() {
      var file_path = playlists[playlistIndex].playlist[currentSongIndexConst].songPath;
      var a = document.createElement('A');
      a.href = file_path;
      a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    newTableRow.append(tableSongNum, tableTitleLength, tableDownloadButton);
    songIndexTable.append(newTableRow);
  }

  tableDiv.append(songIndexTable);
}

function frontendUpdateNowPlaying(songIndex){
  var songIndexTable = document.getElementById("playlistTable");

  const allInTable = document.querySelectorAll('#playlistTable > *');
  for (const element of allInTable) {
    var trackNumberElement = element.getElementsByClassName("trackNumber")[0];

    if (element.id == songIndex.toString()) {
      trackNumberElement.innerHTML = "<img id='littlePlayButton' src='assets/songplay.png'>";
    }

    else{
    //if ((trackNumberElement.innerHTML === "<img id=\"littlePlayButton\" src=\"songplay.png\">" || trackNumberElement.innerHTML === "<img id=\"littlePlayButton\" src=\"songpause.png\">")&& element.id != songIndex.toString()){
      var songNumberFormat = Number(element.id) + 1;
      trackNumberElement.innerHTML = songNumberFormat.toString() + ".";
    //}
    }
  }

}

function frontendBuildAlbumIndex(){
  var moreAlbumsBox = document.getElementById("albumsInQuestion");
  var totalMoreAlbumsBox = document.getElementById("allAlbumsInQuestion");

  while (moreAlbumsBox.firstChild){
    moreAlbumsBox.removeChild(moreAlbumsBox.firstChild);
  }

  while (totalMoreAlbumsBox.firstChild){
    totalMoreAlbumsBox.removeChild(totalMoreAlbumsBox.firstChild);
  }

  if (playlists.length > 5) {
    viewAllButton.style.display = "block";
    viewAllButton.href="javascript:frontendOpenCloseModal()";

    var iterationNum = 4;
    
    for (var i = 0; i < iterationNum; i++){
      if (i != selectedPlaylist){
        const playlistNameTemp = playlists[i].playlistName;
        var albumThumb = document.createElement('div');

        var paraHolder = document.createElement('p');
        paraHolder.className = "albumSnippet";
        paraHolder.id = "album" + i.toString();

        var imageThingy = document.createElement('img');
        imageThingy.src = playlists[i].coverImage;
        
        imageThingy.onclick = function() {
          ifPlayerPlayingPlay();
          loadPlaylistToPlayer(playlistNameTemp);
          $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

        paraHolder.appendChild(imageThingy);

        var titleSpan = document.createElement('span') ;

        titleSpan.innerText = playlistNameTemp;
        paraHolder.appendChild(titleSpan);

        moreAlbumsBox.appendChild(paraHolder);

      }

      else {
        iterationNum++;
      }
    }


    for (var i = 0; i < playlists.length; i++){
      if (i != selectedPlaylist){
        const playlistNameTemp = playlists[i].playlistName;
        var albumThumb = document.createElement('div');

        var paraHolder = document.createElement('p');
        paraHolder.className = "albumSnippet";
        paraHolder.id = "album" + i.toString();

        var imageThingy = document.createElement('img');
        imageThingy.src = playlists[i].coverImage;
        
        imageThingy.onclick = function() {
          ifPlayerPlayingPlay();
          loadPlaylistToPlayer(playlistNameTemp);
          frontendOpenCloseModal();
          $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

        paraHolder.appendChild(imageThingy);

        var titleSpan = document.createElement('span') ;

        titleSpan.innerText = playlistNameTemp;
        paraHolder.appendChild(titleSpan);

        totalMoreAlbumsBox.appendChild(paraHolder);

      }
    }
    numberOfBlanks = 4 - ((playlists.length - 1) % 4);

    //generate blank class divs for spacing.
    for (var i = 0; i < numberOfBlanks; i++){
      var paraHolder = document.createElement('p');
      paraHolder.className = "albumSnippet";

      totalMoreAlbumsBox.appendChild(paraHolder);
    }
  }

  else {
    for (var i = 0; i < playlists.length; i++){
      if (i != selectedPlaylist){
        const playlistNameTemp = playlists[i].playlistName;
        var albumThumb = document.createElement('div');

        var paraHolder = document.createElement('p');
        paraHolder.className = "albumSnippet";
        paraHolder.id = "album" + i.toString();

        var imageThingy = document.createElement('img');
        imageThingy.src = playlists[i].coverImage;
        
        imageThingy.onclick = function() {
          ifPlayerPlayingPlay();
          loadPlaylistToPlayer(playlistNameTemp);
          $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

        paraHolder.appendChild(imageThingy);

        var titleSpan = document.createElement('span') ;

        titleSpan.innerText = playlistNameTemp;
        paraHolder.appendChild(titleSpan);

        moreAlbumsBox.appendChild(paraHolder);

      }
    }

  }
}

var albumIndexModal = document.getElementById("albumIndexModal");
albumIndexModal.style.display = "none";

window.onclick = function(event) {
  if (event.target == albumIndexModal) {
    albumIndexModal.style.display = "none";
  }
}

function frontendOpenCloseModal(){

  if (albumIndexModal.style.display == "none") {
    albumIndexModal.style.display = "flex";
  }

  else {
    albumIndexModal.style.display = "none";
  }
}

var modalToggleButton = document.getElementById("modalClose");

modalToggleButton.onclick = function() {
  frontendOpenCloseModal();
}