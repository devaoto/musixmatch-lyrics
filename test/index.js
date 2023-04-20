const { MusixmatchAPI } = require("../dist");
const mxm = new MusixmatchAPI("18d9fbcac52e279a77b616137280b1eb");

mxm.getLyricsByNames(10, "On The Low").then((lyrics) => {
  console.log(
    lyrics.lyrics_body,
    "\n",
    "ID: " + lyrics.lyrics_id,
    "\n",
    lyrics.lyrics_copyright
  );
});
