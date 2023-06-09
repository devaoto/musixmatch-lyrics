export interface AlbumTracksGet {
  track_list: [
    {
      track: {
        track_id: number;
        track_mbid: string;
        track_length: number;
        lyrics_id: number;
        instrumental: number;
        subtitle_id: number;
        track_name: string;
        track_rating: number;
        album_name: string;
        album_id: number;
        artist_id: number;
        album_coverart_100x100: string;
        artist_mbid: string;
        artist_name: string;
        updated_time: string;
      };
    }
  ];
}
