<html>

<title>music!!!!!!</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="music.css">
<link rel="icon" type="image/png" sizes="32x32" href="favicon.png">

<?php include "/var/wwrepo/off-site-scripts/getMusicArrays.php"; ?>


<script src="https://code.jquery.com/jquery-3.6.0.js" type="module"></script>
<script src="howler.js" type="module"></script>
<script src="music.js" type="module"></script>

<div class="nojscontentbox">

<h1>songs</h1>

<table>
  <thead>
  <tr>
      <th class="table-header-date">Date</th>
      <th class="table-header-title">Title</th>
  </tr>
  </thead>

  <tbody>

  <?php
      require "/var/wwrepo/docs/php/dbhandler.php";
      $songIndex = new indexDBHandler("public_songs");
      $songIndex->prepPublicSongsprint();
      $songIndex->printSongsIndex("/archive/content/musicfiles/");
  ?>



  </tbody>
</table>

<h1>instrumentals</h1>

<table>
  <thead>
  <tr>
      <th class="table-header-date">Date</th>
      <th class="table-header-title">Title</th>
  </tr>
  </thead>

  <tbody>

  <?php
      $songIndex->printSongInstrumentalIndex("/archive/content/musicfiles/");
  ?>



  </tbody>
</table>

<h1>covers</h1>

<table>
<thead>
<tr>
<th class="table-header-date">Date</th>
<th class="table-header-title">Title</th>
</tr>
</thead>

<tbody>

<?php
$songIndex->printSongCoverIndex("/archive/content/musicfiles/");
?>



</tbody>
</table>

<h1>fragments</h1>

<table>
    <thead>
    <tr>
        <th class="table-header-date">Date</th>
        <th class="table-header-title">Title</th>
    </tr>
    </thead>

    <tbody>

    <?php

        $songIndex->printSongFragmentsIndex("/archive/content/musicfiles/");
    ?>



    </tbody>
</table>




</div>

</html>
