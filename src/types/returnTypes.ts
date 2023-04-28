import { GetLyrics, SubtitleInt, TrackInfo } from "../interfaces";
import { MusixmatchBoolean, MusixmatchString } from "./rawDataTypes";

type LyricsReturnType = Promise<GetLyrics>;
type TrackIDReturnType = Promise<MusixmatchString>;
type SubtitleReturnType = Promise<SubtitleInt>;
type TranslationReturnType = Promise<MusixmatchString>;
type TrackInfoRetrunType = Promise<TrackInfo>;
type HasLyricsReturnType = Promise<MusixmatchBoolean>;

export {
  LyricsReturnType,
  TrackIDReturnType,
  SubtitleReturnType,
  TranslationReturnType,
  TrackInfoRetrunType,
  HasLyricsReturnType,
};
