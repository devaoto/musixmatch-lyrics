import {
  ChartArtist,
  ChartTracks,
  GetLyrics,
  SubtitleInt,
  TrackInfo,
} from "../interfaces";
import { MusixmatchBoolean, MusixmatchString } from "./rawDataTypes";

type LyricsReturnType = Promise<GetLyrics | undefined>;
type TrackIDReturnType = Promise<MusixmatchString | undefined>;
type SubtitleReturnType = Promise<SubtitleInt | undefined>;
type TranslationReturnType = Promise<MusixmatchString | undefined>;
type TrackSearchRetrunType = Promise<TrackInfo | undefined>;
type HasLyricsReturnType = Promise<MusixmatchBoolean | undefined>;
type TrackGetReturnType = Promise<MusixmatchString | undefined>;
type ChartArtistReturnType = Promise<ChartArtist | undefined>;
type ChartTracksReturnType = Promise<ChartTracks | undefined>;

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
