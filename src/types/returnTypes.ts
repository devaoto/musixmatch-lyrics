import {
  ChartArtist,
  ChartTracks,
  GetLyrics,
  SubtitleInt,
  TrackInfo,
} from "../interfaces";
import { MusixmatchBoolean, MusixmatchString } from "./rawDataTypes";

type LyricsReturnType = Promise<GetLyrics>;
type TrackIDReturnType = Promise<MusixmatchString>;
type SubtitleReturnType = Promise<SubtitleInt>;
type TranslationReturnType = Promise<MusixmatchString>;
type TrackSearchRetrunType = Promise<TrackInfo>;
type HasLyricsReturnType = Promise<MusixmatchBoolean>;
type TrackGetReturnType = Promise<MusixmatchString>;
type ChartArtistReturnType = Promise<ChartArtist>;
type ChartTracksReturnType = Promise<ChartTracks>;

export {
  LyricsReturnType,
  TrackIDReturnType,
  SubtitleReturnType,
  TranslationReturnType,
  TrackSearchRetrunType,
  HasLyricsReturnType,
  TrackGetReturnType,
  ChartArtistReturnType,
  ChartTracksReturnType,
};
