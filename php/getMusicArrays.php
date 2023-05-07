<?php

  include "/var/wwrepo/off-site-scripts/databaseconnector.php"; //open connection to mysql server

  /*
    The code block following this captures the index for all private songs in the song manager software.
  */

  // title
  $stmt = $pdo->prepare("SELECT songTitle FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $titleArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //dateCreated block
  $stmt = $pdo->prepare("SELECT dateCreated FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $datesArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //isViewable array
  $stmt = $pdo->prepare("SELECT isViewable FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $viewBoolArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //htmlPath array
  $stmt = $pdo->prepare("SELECT htmlPath FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $pathsArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  for ($i = 0; $i < count($pathsArray); $i++){
    $pathsArray[$i] = "/archive/content/musicfiles/" . $pathsArray[$i];
  }

  unset($stmt);

  //category array
  $stmt = $pdo->prepare("SELECT category FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $categoryArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //album array
  $stmt = $pdo->prepare("SELECT album FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $albumArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //trackNumber array
  $stmt = $pdo->prepare("SELECT trackNumber FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $trackNoArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //albumImage array
  $stmt = $pdo->prepare("SELECT albumImage FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $albumImageArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  for ($i = 0; $i < count($albumImageArray); $i++){
    if ($albumImageArray[$i]){
      $albumImageArray[$i] = "assets/" . $albumImageArray[$i];
    }
  }

  unset($stmt);

  //songLength array
  $stmt = $pdo->prepare("SELECT songLength FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
  $stmt->execute();
  $songLengthArray = $stmt->fetchAll(PDO::FETCH_COLUMN);

  unset($stmt);

  //songDescription array
    $stmt = $pdo->prepare("SELECT songDescription FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
    $stmt->execute();
    $songDescriptionArray = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
      unset($stmt);

    //songLyrics array
    $stmt = $pdo->prepare("SELECT songLyrics FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
    $stmt->execute();
    $songLyricsArray = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
      unset($stmt);

    //songID array
    $stmt = $pdo->prepare("SELECT songID FROM public_songs ORDER BY album ASC, trackNumber DESC, dateCreated DESC");
    $stmt->execute();
    $songIDArray = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
      unset($stmt);

  $dataHolder = array();

  for ($i = 0; $i < count($titleArray); $i++){
    if ($viewBoolArray[$i]){
      $holderArray = array(
        "id" => $songIDArray[$i],
        "title" => $titleArray[$i],
        "releaseDate" => $datesArray[$i],
        "songPath" => $pathsArray[$i],
        "category" => $categoryArray[$i],
        "album" => $albumArray[$i],
        "trackNumber" => $trackNoArray[$i],
        "albumImagePath" => $albumImageArray[$i],
        "duration" => $songLengthArray[$i],
        "description" => $songDescriptionArray[$i],
        "lyrics" => $songLyricsArray[$i]
      );

      array_push($dataHolder, $holderArray);
    }
  }

  echo json_encode($dataHolder);


?>
