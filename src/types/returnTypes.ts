import { MusixmatchString } from "./rawDataTypes";

type LyricsReturnType = Promise<MusixmatchString>;
type TrackIDReturnType = Promise<MusixmatchString>;
type MacroLyricsReturnType = Promise<MusixmatchString>;
type SubtitleReturnType = Promise<MusixmatchString>;
type TranslationReturnType = Promise<MusixmatchString>;

export {
  LyricsReturnType,
  TrackIDReturnType,
  MacroLyricsReturnType,
  SubtitleReturnType,
  TranslationReturnType,
};
