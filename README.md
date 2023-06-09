# musixmatch-lyrics

A Third-Party node-module that provides access to the Musixmatch API for retrieving lyrics and other related data.

## Installation

```sh
npm i musixmatch-api-node
```

## Usage

```js
const { MusixmatchAPI } = require("musixmatch-api-node");
const mxm = new MusixmatchAPI("APIKey");

// Get Lyrics
async function getLyrics() {
  const ly = await mxm.trackLyricsGet("123455657"); // Your TrackID Here
  console.log(ly);
}

getLyrics();
```

## Functions

- setApiKey() - Set the API Key for accessing all the functions.
- trackLyricsGet() - Get lyrics and other lyrics related info.
- trackSubtitlesGet() - Get subtitles and other subtitles related info.
- matherLyricsGet() - Get lyrics and match it with your database.
- matherSubtitlesGet() - Get subtitles and match it with your database.
- chartArtistGet() - Get current popular artist from your country.
- chartTrackGet() - Get chart of the popular songs from your country.
- getTrackId() - Get song track id.
- getArtistId() - Get the artist id.
- artistGet() - Get artist info.
- trackGet() - Get track info (Simplified).
- trackSearch() - Get track info (Detailed).
- trackSnippetGet() - Get the track snippet.
- hasLyrics() - Check if the song has lyrics.
- hasSubtitles() - Check if the song has subtitles or not.
- isExplicit() - Check if the song is explicit.
- isRestricted() - Check if the song is restricted.
- isInstrumental() - Check if the song is instrumental.
