export interface AlbumGet {
  album_id: number;
  album_mbid: string;
  album_name: string;
  album_rating: number;
  album_release_date: string;
  artist_id: number;
  artist_name: string;
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
  album_pline: string;
  album_copyright: string;
  album_label: string;
  restricted: number;
  updated_time: string;
  external_ids: {
    spotify: string[];
    itunes: string[];
    amazon_music: string[];
  };
}
