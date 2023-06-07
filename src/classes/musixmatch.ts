// Promise for ES3
declare const Promise: typeof globalThis.Promise;

if (typeof Promise === "undefined" || Promise == null) {
  const { Promise: ES6Promise } = require("es6-promise");
  globalThis.Promise = ES6Promise;
}

// Import Axios
// Axios is used to fetch data
// In our case, we will fetch the data from MusixmatchAPI
import axios, { AxiosResponse } from "axios";
// The return Types
import {
  ArtistNameType,
  ChartArtistReturnType,
  ChartTracksReturnType,
  HasLyricsReturnType,
  LyricsReturnType,
  SubtitleReturnType,
  TrackGetReturnType,
  TrackIDReturnType,
  TrackIDType,
  TrackNameType,
  TrackSearchRetrunType,
  TrackSnippetReturnType,
} from "../types";
import { ArtistGetReturnType } from "../types/returnTypes";

// Import Custom Error classes
import {
  MusixmatchAPIError,
  MusixmatchError,
  MusixmatchRangeError,
  MusixmatchReferenceError,
  MusixmatchSyntaxError,
  MusixmatchTypeError,
} from "./errors";

// Lyrics object for I don't know, something I guess?
import { LyricsObj } from "../public";

/**
 * The MusixmatchAPI class
 * - Containing all the important methods.
 *
 * **Functions:**
 * - artistGet()
 * - hasLyrics()
 * - isInstrumental()
 * - isRestricted()
 * - isExclipt()
 * - hasSubtitle()
 * - trackLyricsGet()
 * - trackSubtitlesGet()
 * - matherLyricsGet()
 * - matherSubtitlesGet()
 * - getArtistId()
 * - getTrackId()
 * - trackGet()
 * - trackSearch()
 * - chartArtistGet()
 * - chartTrackGet()
 * - trackSnippetGet()
 * - trackLyricsPost()
 */
class MusixmatchAPI {
  private apiKey: string | undefined;

  /**
   * The base constructor containing all the methods
   * @param {string} apiKey - The Musixmatch API Key
   */
  constructor(apiKey?: string) {
    if (typeof apiKey !== "undefined" ?? typeof apiKey !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof apiKey} instead.`
      );
    }

    this.apiKey = apiKey;
  }

  /**
   * Set the API Key globally
   * @param {string} apiKey - The MusixmatchAPI Key
   */
  setApiKey(apiKey: string) {
    if (typeof apiKey !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof apiKey} instead.`
      );
    }
    this.apiKey = apiKey;
  }

  private checkError(error: any) {
    if (error instanceof SyntaxError) {
      throw new MusixmatchSyntaxError(error?.message);
    } else if (error instanceof TypeError) {
      throw new MusixmatchTypeError(error?.message);
    } else if (error instanceof ReferenceError) {
      throw new MusixmatchReferenceError(error?.message);
    } else if (error instanceof RangeError) {
      throw new MusixmatchRangeError(error?.message);
    } else {
      throw new MusixmatchError(error?.message);
    }
  }

  private handleStatusCode(statusCode: number) {
    try {
      if (statusCode ?? typeof statusCode === "number") {
        try {
          if (statusCode === 400) {
            return "[400] Bad Request";
          } else if (statusCode === 401) {
            return "[401] Invalid API Key";
          } else if (statusCode === 404) {
            return "[404] Resource Not Found";
          } else if (statusCode === 405) {
            return "[405] Method Not Allowed";
          } else if (statusCode === 429) {
            return "[429] Too Many Requests";
          } else if (statusCode === 500) {
            return "[500] Server Error";
          } else if (statusCode === 503) {
            return "[503] Server Busy";
          } else {
            return "[000] Unknown Error";
          }
        } catch (e: any) {
          throw new MusixmatchError(e?.message);
        } finally {
          switch (statusCode) {
            case 400:
              return "[400] Bad Request";
            case 401:
              return "[401] Invalid API Key";
            case 404:
              return "[404] Resource Not Found";
            case 405:
              return "[405] Method Not Allowed";
            case 429:
              return "[429] Too Many Requests";
            case 500:
              return "[500] Server Error";
            case 503:
              return "[503] Server Busy";
            default:
              return "[000] Unknown Error";
          }
        }
      } else {
        throw new MusixmatchError(
          "Invalid status code provided for handling error."
        );
      }
    } catch (e: any) {
      throw new MusixmatchError(e?.message);
    }
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier Specify trackID or artist name, track name
   * @returns {Promise<LyricsReturnType>} lyrics.
   */

  trackLyricsGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<LyricsReturnType> {
    return new Promise<LyricsReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected Type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const lyrics: any = response?.data?.message?.body?.lyrics;
            resolve(lyrics);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string" || typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
              artistName
            )}&q_track=${encodeURIComponent(trackName)}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackId: string =
              response?.data?.message?.body?.track_list[0]?.track?.track_id;
            const lyricsResponse: AxiosResponse = await axios?.get(
              `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${this?.apiKey}`
            );

            if (lyricsResponse?.status === 200) {
              const subtitles: any =
                lyricsResponse?.data?.message?.body?.lyrics;
              resolve(subtitles);
            } else {
              reject(
                new MusixmatchError(
                  this?.handleStatusCode(lyricsResponse?.status)
                )
              );
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | {artistName: ArtistNameType, trackName: TrackNameType}} identifier
   * @returns {Promise<SubtitleReturnType>} subtitle
   *
   * Get synced lyrics using this function.
   * ! Paid API Key is required.
   */

  trackSubtitlesGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<SubtitleReturnType> {
    return new Promise<SubtitleReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected Type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.subtitles.get?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const subtitles: any = response?.data?.message?.body?.subtitle;
            resolve(subtitles);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string" || typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
              artistName
            )}&q_track=${encodeURIComponent(trackName)}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackId: string =
              response?.data?.message?.body?.track_list[0]?.track?.track_id;
            const subtitleResponse: AxiosResponse = await axios?.get(
              `https://api.musixmatch.com/ws/1.1/track.subtitles.get?track_id=${trackId}&apikey=${this?.apiKey}`
            );

            if (subtitleResponse?.status === 200) {
              const subtitles: any =
                subtitleResponse?.data?.message?.body?.subtitle;
              resolve(subtitles);
            } else {
              reject(
                new MusixmatchError(
                  this?.handleStatusCode(subtitleResponse?.status)
                )
              );
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackNameType} trackName Song Name
   * @param {ArtistNameType} artistName Artist Name
   * @returns {Promise<TrackIDReturnType>} Returns TrackID.
   *
   * Get TrackID
   */
  async getTrackId(
    trackName: TrackNameType,
    artistName: ArtistNameType
  ): Promise<TrackIDReturnType> {
    return new Promise<TrackIDReturnType>(async (resolve, reject) => {
      if (typeof trackName !== "string") {
        reject(
          new MusixmatchTypeError(
            `Expected type to be "string" but got ${typeof trackName} instead.`
          )
        );
      } else if (typeof artistName !== "string") {
        reject(
          new MusixmatchTypeError(
            `Expected type to be "string" but got ${typeof artistName} instead. `
          )
        );
      }

      try {
        const response: AxiosResponse = await axios?.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_track=${trackName}&q_artist=${artistName}&apikey=${this?.apiKey}`
        );

        if (response?.status === 200) {
          const trackId: any =
            response?.data?.message?.body?.track_list[0]?.track?.track_id;
          resolve(trackId);
        } else {
          reject(
            new MusixmatchAPIError(this?.handleStatusCode(response?.status))
          );
        }
      } catch (error: any) {
        this?.checkError(error);
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier specify trackID or artist name, track name
   * @returns {Promise<TrackSearchRetrunType>} Track Info
   * Get Track info with artistName and songName
   */
  async trackSearch(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<TrackSearchRetrunType> {
    return new Promise<TrackSearchRetrunType>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackInfo: TrackSearchRetrunType =
              response?.data?.message.body.track_list[0]?.track;
            resolve(trackInfo);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type "string" but got ${typeof trackName} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_track=${trackName}&q_artist=${artistName}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackInfo: TrackSearchRetrunType =
              response?.data?.message.body.track_list[0]?.track;
            resolve(trackInfo);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier Identifier for trackName, artistName, trackID. Specify trackId only for artist name, track name
   * @returns {Promise<TrackGetReturnType>} simplified track information
   */
  async trackGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<TrackGetReturnType> {
    return new Promise<TrackGetReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=18d9fbcac52e279a77b616137280b1eb`
          );

          if (response?.status === 200) {
            const trackInfo: TrackGetReturnType =
              response?.data?.message?.body?.track;
            resolve(trackInfo);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof trackName} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=18d9fbcac52e279a77b616137280b1eb`
          );

          if (response?.status === 200) {
            const trackInfo: TrackGetReturnType =
              response?.data?.message?.body?.track;
            resolve(trackInfo);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns {Promise<HasLyricsReturnType>} true or false
   *
   * Checks if the track has lyrics or not.
   */
  async hasLyrics(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<HasLyricsReturnType> {
    return new Promise<HasLyricsReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const hasLyrics: any =
              response?.data?.message?.body?.track_list[0]?.track
                ?.has_lyrics === 1;
            resolve(hasLyrics);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
          reject(error);
        }
      } else {
        const { trackName, artistName } = identifier;
        if (typeof artistName !== "string" || typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
          );
          if (response?.status === 200) {
            const hasLyrics: any =
              response?.data?.message?.body?.track_list[0]?.track
                ?.has_lyrics === 1;
            resolve(hasLyrics);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
          reject(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns {Promise<boolean>} boolean
   *
   * Check if the track is instrumental or not.
   */
  async isInstrumental(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.instrumental === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
          );
          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.instrumental === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns {Promise<boolean>} boolean
   *
   * Check if the track is explicit or not.
   */
  async isExplicit(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track?.explicit ===
              1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
          );
          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track?.explicit ===
              1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }
  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns {Promise<boolean>} boolean
   * Check if the track has subtitle or not.
   */
  async hasSubtitle(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.has_subtitle === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.has_subtitle === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns {Promise<boolean>} boolean
   *
   * Check if the song is restricted on musixmatch or not.
   */
  async isRestricted(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (typeof identifier === "string") {
        const trackId = identifier;
        if (typeof trackId !== "string") {
          reject(
            new MusixmatchTypeError(
              "Expected type to be a valid string but got",
              typeof trackId,
              "instead."
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.restricted === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { trackName, artistName } = identifier;
        if (typeof artistName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof artistName} instead.`
            )
          );
        }
        if (typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected type to be a "string" but got ${typeof trackName} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            if (
              response?.data?.message?.body?.track_list[0]?.track
                ?.restricted === 1
            ) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }
  /**
   *
   * @param {string} country A valid country code
   * @param {number} page Define the page number for paginated results
   * @param {number} pageSize Define the page size for paginated results. Range is 1 to 100.
   * @returns {Promise<ChartArtistReturnType>} Artist Chart
   */
  async chartArtistGet(
    country: string,
    page: number,
    pageSize: number = 1
  ): Promise<ChartArtistReturnType> {
    return new Promise<ChartArtistReturnType>(async (resolve, reject) => {
      if (typeof country !== "string") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "string" but got ',
            typeof country,
            "instead."
          )
        );
      }
      if (typeof page !== "number") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "number" but got ',
            typeof page,
            "instead."
          )
        );
      }
      if (typeof pageSize !== "number") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "number" but got ',
            typeof pageSize,
            "instead."
          )
        );
      }
      if (pageSize > 100) {
        reject(
          new MusixmatchRangeError(`Invalid Range: ${pageSize}. Expected: 100`)
        );
      }
      if (pageSize < 1) {
        reject(
          new MusixmatchRangeError(
            `Page Size must be a valid positive number. Got: ${pageSize}`
          )
        );
      }

      try {
        const response: AxiosResponse = await axios?.get(
          `https://api.musixmatch.com/ws/1.1/chart.artists.get?page=${page}&page_size=${pageSize}&country=${country}&apikey=${this?.apiKey}`
        );

        if (response?.status == 200) {
          resolve(response?.data?.message?.body);
        } else {
          reject(
            new MusixmatchAPIError(this?.handleStatusCode(response?.status))
          );
        }
      } catch (e: any) {
        this?.checkError(e);
      }
    });
  }

  /**
   *
   * @param country A valid 2 letters country code. Set XW as worldwide
   * @param page Define the page number for paginated results
   * @param pageSize Define the page size for paginated results. Range is 1 to 100.
   * @param chartName Select among available charts:
   * - top : editorial chart
   * - hot : Most viewed lyrics in the last 2 hours
   * - mxmWeekly : Most viewed lyrics in the last 7 days
   * - mxmWeeklyNew : Most viewed lyrics in the last 7 days limited to new releases only
   * @returns {Promise<ChartTracksReturnType>} Track Chart
   */
  async chartTracksGet(
    country: string,
    page: number,
    pageSize: number = 1,
    chartName: "top" | "hot" | "mxmWeekly" | "mxmWeeklyNew"
  ): Promise<ChartTracksReturnType> {
    return new Promise<ChartTracksReturnType>(async (resolve, reject) => {
      if (typeof country !== "string") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "string" but got ',
            typeof country,
            "instead."
          )
        );
      }
      if (typeof page !== "number") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "number" but got ',
            typeof page,
            "instead."
          )
        );
      }
      if (typeof pageSize !== "number") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "number" but got ',
            typeof pageSize,
            "instead."
          )
        );
      }
      if (typeof chartName !== "string") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "string" but got ',
            typeof chartName,
            "instead."
          )
        );
      }

      if (pageSize > 100) {
        reject(
          new MusixmatchRangeError(`Invalid range: ${pageSize}. Expected: 100`)
        );
      }
      if (pageSize < 1) {
        reject(
          new MusixmatchRangeError(
            `Page Size must be a valid positive number. Got: ${pageSize}`
          )
        );
      }

      if (chartName === "hot") {
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=hot&apikey=${this?.apiKey}`
          );

          if (response?.status == 200) {
            resolve(response?.data?.message?.body);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (e: any) {
          this?.checkError(e);
        }
      } else if (chartName === "top") {
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=top&apikey=${this?.apiKey}`
          );

          if (response?.status == 200) {
            resolve(response?.data?.message.body);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (e: any) {
          throw new MusixmatchError(e?.message);
        }
      } else if (chartName === "mxmWeekly") {
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=mxmweekly&apikey=${this?.apiKey}`
          );

          if (response?.status == 200) {
            resolve(response?.data?.message?.body);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (e: any) {
          this?.checkError(e);
        }
      } else if (chartName === "mxmWeeklyNew") {
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=mxmweekly_new&apikey=${this?.apiKey}`
          );

          if (response?.status == 200) {
            resolve(response?.data?.message?.body);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (e: any) {
          this?.checkError(e);
        }
      } else {
        reject(new MusixmatchError("Invalid chart name", chartName));
      }
    });
  }
  /**
   *
   * @param {LyricsObj} postConfig - The ISRC and Lyrics Object
   *
   * @returns {Promise<string>} Submits lyrics on Musixmatch.
   */
  async trackLyricsPost(postConfig: LyricsObj): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (typeof postConfig?.ISRC !== "string") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be "string" but got ',
            typeof postConfig?.ISRC,
            "instead."
          )
        );
      }
      postConfig?.lyricsContent.forEach((lyricsLine, index) => {
        if (typeof lyricsLine !== "string") {
          reject(
            new MusixmatchTypeError(
              'Expected type to be "string" but got ',
              typeof lyricsLine,
              "instead."
            )
          );
        }
        postConfig.lyricsContent[index] = lyricsLine?.replace(/\n/g, "\n");
      });
      try {
        const response: AxiosResponse = await axios?.post(
          `https://api.musixmatch.com/ws/1.1/track.lyrics.post?track_isrc=${postConfig?.ISRC}&lyrics_body=${postConfig?.lyricsContent}&apikey=${this?.apiKey}`
        );
        if (response?.status === 200) {
          resolve("Lyrics Posted.");
        } else {
          reject(
            new MusixmatchAPIError(this?.handleStatusCode(response?.status))
          );
        }
      } catch (e: any) {
        this?.checkError(e);
      }
    });
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier The TrackID or the artistName, trackName to get lyrics
   * @returns {Promise<LyricsReturnType>} Lyrics
   *
   * ! API Key Required
   *
   */
  async matcherLyricsGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<LyricsReturnType> {
    return new Promise<LyricsReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string" ?? typeof identifier !== "undefined") {
        const trackId = identifier;
        if (typeof trackId !== "string" ?? typeof identifier === "undefined") {
          reject(
            new MusixmatchTypeError(
              `Expected Type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }

        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const lyrics: any = response?.data?.message.body.lyrics;
            resolve(lyrics);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string" || typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
              artistName
            )}&q_track=${encodeURIComponent(trackName)}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackId: string =
              response?.data?.message?.body?.track_list[0]?.track?.track_id;
            const lyricsResponse: AxiosResponse = await axios?.get(
              `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?track_id=${trackId}&apikey=${this?.apiKey}`
            );

            if (lyricsResponse?.status === 200) {
              const subtitles: any =
                lyricsResponse?.data?.message?.body?.lyrics;
              resolve(subtitles);
            } else {
              reject(
                new MusixmatchError(
                  this?.handleStatusCode(lyricsResponse?.status)
                )
              );
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType | {artistName: ArtistNameType, trackName: TrackNameType}} identifier
   * @returns {Promise<SubtitleReturnType>} subtitle
   *
   * Get synced lyrics using this function.
   * ! Paid API Key is required.
   */
  async matcherSubtitlesGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): Promise<SubtitleReturnType> {
    return new Promise<SubtitleReturnType>(async (resolve, reject) => {
      if (typeof identifier === "string" ?? typeof identifier !== "undefined") {
        const trackId = identifier;
        if (typeof trackId !== "string" ?? typeof trackId === "undefined") {
          reject(
            new MusixmatchTypeError(
              `Expected Type to be "string" but got ${typeof trackId} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/matcher.subtitles.get?track_id=${trackId}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const subtitles: any = response?.data?.message?.body?.subtitle;
            resolve(subtitles);
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      } else {
        const { artistName, trackName } = identifier;
        if (typeof artistName !== "string" || typeof trackName !== "string") {
          reject(
            new MusixmatchTypeError(
              `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
            )
          );
        }
        try {
          const response: AxiosResponse = await axios?.get(
            `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
              artistName
            )}&q_track=${encodeURIComponent(trackName)}&apikey=${this?.apiKey}`
          );

          if (response?.status === 200) {
            const trackId: string =
              response?.data?.message?.body?.track_list[0]?.track?.track_id;
            const subtitleResponse: AxiosResponse = await axios?.get(
              `https://api.musixmatch.com/ws/1.1/matcher.subtitles.get?track_id=${trackId}&apikey=${this?.apiKey}`
            );

            if (subtitleResponse?.status === 200) {
              const subtitles: any =
                subtitleResponse?.data?.message?.body?.subtitle;
              resolve(subtitles);
            } else {
              reject(
                new MusixmatchError(
                  this?.handleStatusCode(subtitleResponse.status)
                )
              );
            }
          } else {
            reject(
              new MusixmatchAPIError(this?.handleStatusCode(response?.status))
            );
          }
        } catch (error: any) {
          this?.checkError(error);
        }
      }
    });
  }

  /**
   *
   * @param {TrackIDType} trackID The track ID to get snippet.
   * @returns {Promise<TrackSnippetReturnType>} Track Snippet
   */
  async trackSnippetGet(trackID: TrackIDType): Promise<TrackSnippetReturnType> {
    return new Promise<TrackSnippetReturnType>(async (resolve, reject) => {
      if (typeof trackID !== "string" ?? typeof trackID === "undefined") {
        reject(
          new MusixmatchTypeError(
            'Expected type to be a "string" but got ',
            typeof trackID,
            "instead."
          )
        );
      }
      try {
        const response = await axios?.get(
          `https://api.musixmatch.com/ws/1.1/track.snippet.get?track_id=${trackID}&apikey=${this?.apiKey}`
        );
        if (response?.status == 200) {
          resolve(response?.data?.message?.body);
        } else {
          reject(
            new MusixmatchAPIError(this?.handleStatusCode(response?.status))
          );
        }
      } catch (error: any) {
        this?.checkError(error);
      }
    });
  }
  /**
   * Get ArtistID
   * @param {TrackNameType} trackName - The track name (any track of the artist)
   * @param {ArtistNameType} artistName - The artist name
   * @returns {Promise<number>} artistId
   */
  async getArtistID(trackName: TrackNameType, artistName: ArtistNameType) {
    return new Promise<number>(async (resolve, reject) => {
      if (typeof artistName !== "string" || typeof trackName !== "string") {
        reject(
          new MusixmatchTypeError(
            `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
          )
        );
      }
      try {
        const res = await axios?.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistName}&q_track=${trackName}&apikey=${this?.apiKey}`
        );
        if (res.status == 200) {
          const artistId =
            res.data?.message?.body?.track_list[0]?.track?.artist_id;
          resolve(artistId);
        } else {
          reject(new MusixmatchAPIError(this?.handleStatusCode(res.status)));
        }
      } catch (e) {
        this?.checkError(e);
      }
    });
  }
  /**
   * Get Artist Data (Simplified)
   * @param {number} artistID - The artist id
   * @returns {Promise<ArtistGetReturnType>} artist info
   */
  async artistGet(artistID: number) {
    return new Promise<ArtistGetReturnType>(async (resolve, reject) => {
      if (typeof artistID !== "number" ?? typeof artistID === "undefined") {
        reject(
          new MusixmatchTypeError(
            `Expected type of artist ID to be "number" but got "${typeof artistID}" instead`
          )
        );
      }
      try {
        const res = await axios?.get(
          `https://api.musixmatch.com/ws/1.1/artist.get?artist_id=${artistID}&apikey=${this?.apiKey}`
        );
        if (res.status == 200) {
          const artistGetData = res.data?.message?.body;
          resolve(artistGetData);
        } else {
          reject(new MusixmatchAPIError(this?.handleStatusCode(res.status)));
        }
      } catch (e) {
        this?.checkError(e);
      }
    });
  }
}

export { MusixmatchAPI };
