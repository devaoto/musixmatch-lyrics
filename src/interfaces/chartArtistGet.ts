interface ChartArtist {
  artist_list: [
    {
      artist: {
        artist_id: number;
        artist_mbid: string;
        artist_name: string;
        artist_alias_list: any[];
        artist_rating: number;
        updated_time: string;
      };
    }
  ];
}

export { ChartArtist };
