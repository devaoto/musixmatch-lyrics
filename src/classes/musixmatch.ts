import axios, { AxiosResponse } from "axios";
import {
  ArtistNameType,
  HasLyricsReturnType,
  LyricsReturnType,
  SongNameType,
  SubtitleReturnType,
  TrackIDReturnType,
  TrackIDType,
  TrackInfoRetrunType,
} from "../types";

class MusixmatchAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    if (typeof apiKey !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof apiKey} instead.`
      );
    }

    this.apiKey = apiKey;
  }

  private handleStatusCode(statusCode: number) {
    switch (statusCode) {
      case 400:
        return "Bad Request";
      case 401:
        return "Invalid API Key";
      case 404:
        return "Resource Not Found";
      case 429:
        return "Too Many Requests";
      case 500:
        return "Server Error";
      default:
        return "Unknown Error";
    }
  }

  // Track ID Works //

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

      if (response.status === 200) {
        const lyrics: any = response.data.message.body.lyrics;
        return lyrics;
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
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

      if (response.status === 200) {
        const subtitles: any = response.data.message.body.subtitle;
        return subtitles;
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  // Name Works //

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
      if (response.status === 200) {
        const trackId: string =
          response.data.message.body.track_list[0].track.track_id;
        return trackId;
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {ArtistNameType} artistName
   * @param {SongNameType} trackName
   * @returns {LyricsReturnType} Lyrics
   *
   * It uses artistName and trackName parameter to get lyrics.
   */

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
      const lyrics: any = response.data.message.body.lyrics;
      return lyrics;
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {ArtistNameType} artistName
   * @param {SongNameType} songName
   * @returns Synced Lyrics
   *
   * It uses `artistName` and `songName` parameter to get synced lyrics
   *
   * @example ```js
   * const { MusixmatchAPI } = require("musixmatch");
   * const mxm = new MusixmatchAPI("XXX"); // Replace 'XXX' with your API Key.
   *
   * mxm.getSubtitleByNames("Fiz", "On The Low").then((sub) => {
   *    console.log(sub);
   * });
   * ```
   *
   * To Display with Timing:
   * ```js
   * const { MusixmatchAPI } = require("musixmatch");
   * const mxm = new MusixmatchAPI("XXX"); // Replace 'XXX' with your API Key.
   *
   * mxm.getSubtitleByName("Fiz", "On The Low").then((sub) => {
   * })
   */

  async getSubtitleByNames(
    artistName: ArtistNameType,
    songName: SongNameType
  ): SubtitleReturnType {
    if (typeof artistName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type "string" but got ${typeof artistName} instead.`
      );
    }
    if (typeof songName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type "string" but got ${typeof artistName} instead.`
      );
    }
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.subtitles.get?q_track=${songName}&q_artist=${artistName}&apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        const subtitles: any = response.data.message.body.subtitle;
        return subtitles;
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {ArtistNameType} artistName
   * @param {SongNameType} songName
   * @returns {TrackInfoReturnType} Track Info
   *
   * Get Track info with artistName and songName
   */

  async trackInfo(
    artistName: ArtistNameType,
    songName: SongNameType
  ): TrackInfoRetrunType {
    if (typeof artistName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type "string" but got ${typeof artistName} instead.`
      );
    }
    if (typeof songName !== "string") {
      throw new MusixmatchTypeError(
        `Expected type "string" but got ${typeof artistName} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&q_artist=${artistName}&apikey=${this.apiKey}`
      );
      return response.data.message.body.track_list[0].track;
    } catch (e: any) {
      throw new MusixmatchError(e.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId
   * @returns true or false
   *
   * Checks if the track has lyrics or not.
   */

  async hasLyrics(trackId: TrackIDType): HasLyricsReturnType {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackId} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        if (response.data.message.body.track.has_lyrics === 1) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId
   * @returns boolean
   *
   * Check if the track is instrumental or not.
   */

  async isInstrumental(trackId: TrackIDType) {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackId} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        if (response.data.message.body.track.instrumental === 1) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId
   * @returns boolean
   *
   * Check if the track is explicit ot not.
   */

  async isExplicit(trackId: TrackIDType) {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackId} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        if (response.data.message.body.track.explicit === 1) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }

  /**
   *
   * @param {TrackIDType} trackId
   * @returns boolean
   *
   * Check if the track has subtitle or not.
   */

  async hasSubtitle(trackId: TrackIDType) {
    if (typeof trackId !== "string") {
      throw new MusixmatchTypeError(
        `Expected type to be "string" but got ${typeof trackId} instead.`
      );
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        if (response.data.message.body.track.has_subtitle === 1) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (error: any) {
      throw new MusixmatchError(error.message);
    }
  }
}

// ERROR CLASSES

class MusixmatchTypeError extends Error {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchTypeError";
  }
}

class MusixmatchError extends Error {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchError";
  }
}

export { MusixmatchAPI };
