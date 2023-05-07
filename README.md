# JavaScript Music Player

This is the public-facing repository for my currently live music player that can be found at [willwitherspoon.net/music](https://willwitherspoon.net/music)

## About

Meant to be a page in the replacement for my [art portfolio](https://github.com/witherspoonwd/wwrepo-public), this fully interactive music player was my first ever JavaScript project developed in the summer of 2022.

Built in vanilla JavaScript with Howl.js & a tiny amount of JQuery, this online music player pulls from an already existing MySQL database, builds playlists/albums based off of database information, and then displays them to the user in a format similar to Bandcamp or Spotify. Featuring all standard playback functions, a functioning volume and duration slider, a visualizer, song information and lyrics, and downloads for each song, this is meant to be a public repository for my music.

While the project in it's current state is fully functional, there are a few shortfalls under the hood that need to be addressed, including it's methods of altering the DOM, large memory footprint, and it's lack of code organization such as classes. Eventually I plan to create a Next.js/React.js version with a rewritten version of the player class.