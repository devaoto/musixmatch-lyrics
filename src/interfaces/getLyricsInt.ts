interface GetLyrics {
  lyrics_id: number;
  explicit: number;
  lyrics_body: string;
  script_tracking_url: string;
  pixel_tracking_url: string;
  lyrics_copyright: string;
  updated_time: string;
}

const lyricsInt = () => {
  console.log("JSON:\n");
  console.log(
    "lyrics_id: number;\nexplicit: number;\nlyrics_body: string;\nscript_tracking_url: string;\npixel_tracking_url: string;\nlyrics_copyright: string;\nupdated_time: string;"
  );
};

export { GetLyrics, lyricsInt };
