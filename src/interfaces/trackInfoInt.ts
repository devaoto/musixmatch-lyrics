interface TrackInfo {
  track_id: number;
  track_name: string;
  artist_name: string;
  artist_id: number;
  album_name: string;
  album_id: number;
  track_rating: number;
  explicit: number;
  has_lyrics: number;
  has_subtitles: number;
  has_richsync: number;
  num_favourite: number;
  instrumental: number;
  track_share_url: string;
  track_edit_url: string;
  restricted: number;
  updated_time: string;
  track_name_translation_list: any[];
  commontrack_id: number;
  primary_genres: {
    music_genre_list: [
      {
        music_genre: {
          music_genre_id: number;
          music_genre_parent_id: number;
          music_genre_name: string;
          music_genre_name_extended: string;
          music_genre_vanity: string;
        };
      }
    ];
  };
}

export { TrackInfo };
