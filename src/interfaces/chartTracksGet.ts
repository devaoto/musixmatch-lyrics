interface ChartTracks {
  track_list: [
    {
      track: {
        track_id: number;
        track_name: string;
        track_name_translation_list: any[];
        track_rating: number;
        commontrack_id: number;
        instrumental: number;
        explicit: number;
        has_lyrics: number;
        has_subtitles: number;
        has_richsync: number;
        num_favourite: number;
        album_id: number;
        album_name: string;
        artist_id: number;
        artist_name: string;
        track_share_url: string;
        track_edit_url: string;
        restricted: number;
        updated_time: string;
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
      };
    }
  ];
}

export { ChartTracks };
