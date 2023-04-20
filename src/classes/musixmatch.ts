import axios, { AxiosResponse } from "axios";
import {
  ArtistNameType,
  LyricsReturnType,
  SongNameType,
  SubtitleReturnType,
  TrackIDReturnType,
  TrackIDType,
  TranslationReturnType,
} from "../types";

class MusixmatchAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    if (typeof apiKey !== "string") {
      throw new TypeError(
        `Expected Type to be "string" but got ${typeof apiKey} instead.`
      );
    }

    this.apiKey = apiKey;
  }

  /**
   *
   * @param {TrackIDType} trackId The TrackID to get lyrics
   * @returns {LyricsReturnType} Lyrics
   *
   * ! API Key Required
   *
   * USAGE (TypeScript):
   * ```ts
   * import { MusixmatchAPI } from "musixmatch";
   *
   * const Mxm = new MusixmatchAPI("XXX");
   *
   * console.log(await Mxm.getLyrics(12345678));
   * ```
   *
   *
   * USAGE (JavaScript):
   * ```js
   * const { MusixmatchAPI } = require("musixmatch");
   *
   * const mxm = new MusixmatchAPI("xxx");
   *
   * mxm.getLyrics(12345678).then((lyrics) => {
   *    console.log(lyrics);
   * })
   * ```
   */

  async getLyrics(trackId: TrackIDType): LyricsReturnType {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof trackId} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${this.apiKey}`
      );
      const lyrics: string = response.data.message.body.lyrics;
      return lyrics;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId TrackID
   * @returns {TrackIDReturnType} Synced Lyrics!
   *
   * Unlike `getLyrics()` it is used to get Synced Lyrics.
   */

  async getSubtitles(trackId: TrackIDType): SubtitleReturnType {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof trackId} instead.`
      );
    }
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.subtitles.get?track_id=${trackId}&apikey=${this.apiKey}`
      );
      const subtitles: string = response.data.message.body.subtitle;
      return subtitles;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId
   * @returns {TranslationReturnType} Translation of the lyrics
   *
   * Get Translation of the lyrics.
   */
  async getTranslation(trackId: TrackIDType): TranslationReturnType {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof trackId} instead.`
      );
    }
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.lyrics.translation.get?track_id=${trackId}&apikey=${this.apiKey}`
      );
      const syncedLyrics: string =
        response.data.message.body.lyrics_translations[0].lyrics
          .translation_body;
      return syncedLyrics;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {SongNameType} trackName Song Name
   * @param {ArtistNameType} artistName Artist Name
   * @returns {TrackIDReturnType} Returns TrackID.
   *
   * Get TrackID
   */
  async getTrackId(
    trackName: SongNameType,
    artistName: ArtistNameType
  ): TrackIDReturnType {
    if (typeof trackName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackName} instead.`
      );
    } else if (typeof artistName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof artistName} instead. `
      );
    }
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.search?q_track=${trackName}&q_artist=${artistName}&apikey=${this.apiKey}`
      );
      const trackId: string =
        response.data.message.body.track_list[0].track.track_id;
      return trackId;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }
  async getLyricsByNames(
    artistName: ArtistNameType,
    trackName: SongNameType
  ): LyricsReturnType {
    if (typeof trackName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackName} instead.`
      );
    } else if (typeof artistName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof artistName} instead. `
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&callback=callback&q_track=${trackName}&q_artist=${artistName}&apikey=${this.apiKey}`
      );
      const lyrics: string = response.data.message.body.lyrics;
      return lyrics;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }
}

class MusixmatchTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MusixmatchAPITypeError";
  }
}

class MusixmatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MusixmatchAPIError";
  }
}

export { MusixmatchAPI };
