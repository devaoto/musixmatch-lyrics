export interface ArtistGet {
  artist_id: number;
  artist_name: string;
  artist_name_translation_list: any[];
  artist_comment: string;
  artist_country: string;
  artist_alias_list: any[];
  artist_rating: number;
  artist_twitter_url: string;
  artist_credits: { artist_list: any[] };
  restricted: number;
  updated_time: string;
  begin_date_year: string;
  begin_date: string;
  end_date_year: string;
  end_date: string;
}
