const { MusixmatchAPI } = require("../dist");
const mxm = new MusixmatchAPI("APIKey");

mxm.trackInfo(90, 1).then((l) => {
  console.log(l.explicit);
});

// mxm.getLyricsByNames("FiZ", "On The Low").then((lyrics) => {
// if (mxm.hasLyrics("FiZ", "On The Low")) {
//   console.log(
//     lyrics.lyrics_body,
//     "\n",
//     "ID: " + lyrics.lyrics_id,
//     "\n",
//     lyrics.lyrics_copyright
//   );
// } else {
//   console.log("Lyrics Not Available.");
// }
// });
