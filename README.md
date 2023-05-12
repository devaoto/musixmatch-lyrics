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
  const ly = await mxm.getLyrics("123455657"); // Your TrackID Here
  console.log(ly);
}

getLyrics();
```

Full docs website coming soon :)
