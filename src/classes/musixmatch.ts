if (typeof Promise === "undefined" || Promise == null) {
  const Promise = require("es6-promise").Promise;
}

import axios, { AxiosResponse } from "axios";
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
} from "../types";
import { MusixmatchError, MusixmatchTypeError } from "./errors";

class MusixmatchAPI {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    if (typeof apiKey !== "undefined" && typeof apiKey !== "string") {
      throw new MusixmatchTypeError(
        `Expected Type to be "string" but got ${typeof apiKey} instead.`
      );
    }

    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
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

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier Specify trackID or artist name, track name
   * @returns {LyricsReturnType} lyrics.
   */

  async trackLyricsGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): LyricsReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string" || typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
            artistName
          )}&q_track=${encodeURIComponent(trackName)}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          const trackId: string =
            response.data.message.body.track_list[0].track.track_id;
          const lyricsResponse: AxiosResponse = await axios.get(
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackId}&apikey=${this.apiKey}`
          );

          if (lyricsResponse.status === 200) {
            const subtitles: any = lyricsResponse.data.message.body.lyrics;
            return subtitles;
          } else {
            throw new MusixmatchError(
              this.handleStatusCode(lyricsResponse.status)
            );
          }
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (error: any) {
        throw new MusixmatchError(error.message);
      }
    }
  }

  /**
   *
   * @param {TrackIDType | {artistName: ArtistNameType, trackName: TrackNameType}} identifier
   * @returns {SubtitleReturnType} subtitle
   *
   * Get synced lyrics using this function.
   * ! Paid API Key is required.
   */

  async trackSubtitlesGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): SubtitleReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string" || typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
            artistName
          )}&q_track=${encodeURIComponent(trackName)}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          const trackId: string =
            response.data.message.body.track_list[0].track.track_id;
          const subtitleResponse: AxiosResponse = await axios.get(
            `https://api.musixmatch.com/ws/1.1/track.subtitles.get?track_id=${trackId}&apikey=${this.apiKey}`
          );

          if (subtitleResponse.status === 200) {
            const subtitles: any = subtitleResponse.data.message.body.subtitle;
            return subtitles;
          } else {
            throw new MusixmatchError(
              this.handleStatusCode(subtitleResponse.status)
            );
          }
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (error: any) {
        throw new MusixmatchError(error.message);
      }
    }
  }

  // Name Works //

  /**
   *
   * @param {TrackNameType} trackName Song Name
   * @param {ArtistNameType} artistName Artist Name
   * @returns {TrackIDReturnType} Returns TrackID.
   *
   * Get TrackID
   */
  async getTrackId(
    trackName: TrackNameType,
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
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier specify trackID or artist name, track name
   * @returns {TrackSearchRetrunType} Track Info
   * Get Track info with artistName and songName
   */

  async trackSearch(
    identifier:
      | TrackIDType
      | {
          artistName: ArtistNameType;
          trackName: TrackNameType;
        }
  ): TrackSearchRetrunType {
    if (typeof identifier === "string") {
      const trackId = identifier;
      if (typeof trackId !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be "string" but got ',
          typeof trackId,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?track_id=${trackId}&apikey=${this.apiKey}`
        );
        if (response.status == 200) {
          return response.data.message.body.track_list[0].track;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          `Expected type "string" but got ${typeof artistName} instead.`
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          `Expected type "string" but got ${typeof trackName} instead.`
        );
      }

      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_track=${trackName}&q_artist=${artistName}&apikey=${this.apiKey}`
        );
        if (response.status == 200) {
          return response.data.message.body.track_list[0].track;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    }
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier Identifier for trackName, artistName, trackID. Specify trackId only for artist name, track name
   * @returns {TrackGetReturnType} simplified track information
   */

  async trackGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): TrackGetReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
      if (typeof trackId !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be "string" but got ',
          typeof trackId,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=18d9fbcac52e279a77b616137280b1eb`
        );
        if (response.status == 200) {
          return response.data.message.body.track;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (error: any) {
        throw new MusixmatchError(error.message);
      }
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=18d9fbcac52e279a77b616137280b1eb`
        );
        if (response.status == 200) {
          return response.data.message.body.track;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (err: any) {
        throw new MusixmatchError(err.message);
      }
    }
  }
  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns true or false
   *
   * Checks if the track has lyrics or not.
   */

  async hasLyrics(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): HasLyricsReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { trackName, artistName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=${this.apiKey}`
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
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns boolean
   *
   * Check if the track is instrumental or not.
   */

  async isInstrumental(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ) {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=${this.apiKey}`
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
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns boolean
   *
   * Check if the track is explicit ot not.
   */

  async isExplicit(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ) {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=${this.apiKey}`
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
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns boolean
   *
   * Check if the track has subtitle or not.
   */

  async hasSubtitle(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ) {
    if (typeof identifier === "string") {
      const trackId = identifier;
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=${this.apiKey}`
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
  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier
   * @returns boolean
   *
   * Check if the song is restricted on musixmatch or not.
   */
  async isRestricted(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ) {
    if (typeof identifier === "string") {
      const trackId = identifier;
      if (typeof trackId !== "string") {
        throw new MusixmatchTypeError(
          "Expected type to be a valid string but got",
          typeof trackId,
          "instead."
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?track_id=${trackId}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          if (response.data.message.body.track.restricted === 1) {
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
    } else {
      const { trackName, artistName } = identifier;
      if (typeof artistName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof artistName,
          "instead."
        );
      }
      if (typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be a "string" but got',
          typeof trackName,
          "instead."
        );
      }

      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.get?q_artist=${artistName}&q_track=${trackName}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          if (response.data.message.body.track.restricted === 1) {
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
  /**
   *
   * @param {string} country A valid country code
   * @param {number} page Define the page number for paginated results
   * @param {number} pageSize Define the page size for paginated results. Range is 1 to 100.
   * @returns {ChartArtistReturnType} Artist Chart
   */
  async chartArtistGet(
    country: string,
    page: number,
    pageSize: number
  ): ChartArtistReturnType {
    if (typeof country !== "string") {
      throw new MusixmatchTypeError(
        'Expected type to be "string" but got ',
        typeof country,
        "instead."
      );
    }
    if (typeof page !== "number") {
      throw new MusixmatchTypeError(
        'Expected type to be "number" but got ',
        typeof page,
        "instead."
      );
    }
    if (typeof pageSize !== "number") {
      throw new MusixmatchTypeError(
        'Expected type to be "number" but got ',
        typeof pageSize,
        "instead."
      );
    }

    try {
      const response: AxiosResponse =
        await axios.get(`https://api.musixmatch.com/ws/1.1/chart.artists.get?page=${page}&page_size=${pageSize}&country=${country}&apikey=${this.apiKey}
        `);
      if (response.status == 200) {
        return response.data.message.body;
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (e: any) {
      throw new MusixmatchError(e.message);
    }
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
   * @returns {ChartTracksReturnType} Track Chart
   */

  async chartTracksGet(
    country: string,
    page: number,
    pageSize: number,
    chartName: "top" | "hot" | "mxmWeekly" | "mxmWeeklyNew"
  ): ChartTracksReturnType {
    if (typeof country !== "string") {
      throw new MusixmatchTypeError(
        'Expected type to be "string" but got ',
        typeof country,
        "instead."
      );
    }
    if (typeof page !== "number") {
      throw new MusixmatchTypeError(
        'Expected type to be "number" but got ',
        typeof page,
        "instead."
      );
    }
    if (typeof pageSize !== "number") {
      throw new MusixmatchTypeError(
        'Expected type to be "number" but got ',
        typeof pageSize,
        "instead."
      );
    }
    if (typeof chartName !== "string") {
      throw new MusixmatchTypeError(
        'Expected type to be "string" but got ',
        typeof chartName,
        "instead."
      );
    }

    if (chartName === "hot") {
      try {
        const response: AxiosResponse =
          await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=hot&apikey=${this.apiKey}
          `);
        if (response.status == 200) {
          return response.data.message.body;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    } else if (chartName === "top") {
      try {
        const response: AxiosResponse =
          await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=top&apikey=${this.apiKey}
          `);
        if (response.status == 200) {
          return response.data.message.body;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    } else if (chartName === "mxmWeekly") {
      try {
        const response: AxiosResponse =
          await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=mxmweekly&apikey=${this.apiKey}
          `);
        if (response.status == 200) {
          return response.data.message.body;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    } else if (chartName === "mxmWeeklyNew") {
      try {
        const response: AxiosResponse =
          await axios.get(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?page=${page}&page_size=${pageSize}&country=${country}&chart_name=mxmweekly_new&apikey=${this.apiKey}
          `);
        if (response.status == 200) {
          return response.data.message.body;
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (e: any) {
        throw new MusixmatchError(e.message);
      }
    } else {
      throw new MusixmatchError("Invalid chart name", chartName);
    }
  }

  /**
   *
   * @param commontrackId A valid commontrack_id
   * @param ISRC A valid isrc
   * @param lyricsBody The lyrics
   *
   * @returns {TrackLyricsPostType} Submits lyrics on Musixmatch.
   */
  async trackLyricsPost(ISRC: string, ...lyricsBody: string[]) {
    if (typeof ISRC !== "string") {
      throw new MusixmatchTypeError(
        'Expected type to be "string" but got',
        typeof ISRC,
        "instead."
      );
    }
    lyricsBody.forEach((lyricsLine, index) => {
      if (typeof lyricsLine !== "string") {
        throw new MusixmatchTypeError(
          'Expected type to be "string" but got',
          typeof lyricsLine,
          "instead."
        );
      }
      lyricsBody[index] = lyricsLine.replace(/\n/g, "\n");
    });
    try {
      const response: AxiosResponse = await axios.post(
        `https://api.musixmatch.com/ws/1.1/track.lyrics.post?track_isrc=${ISRC}&lyrics_body=${lyricsBody}&apikey=${this.apiKey}`
      );
      if (response.status === 200) {
        return "Lyrics Posted.";
      } else {
        throw new MusixmatchError(this.handleStatusCode(response.status));
      }
    } catch (e: any) {
      throw new MusixmatchError(e.message);
    }
  }

  /**
   *
   * @param {TrackIDType | { artistName: ArtistNameType, trackName: TrackNameType }} identifier The TrackID or the artistName, trackName to get lyrics
   * @returns {LyricsReturnType} Lyrics
   *
   * ! API Key Required
   *
   */

  async matcherLyricsGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): LyricsReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
      if (typeof trackId !== "string") {
        throw new MusixmatchTypeError(
          `Expected Type to be "string" but got ${typeof trackId} instead.`
        );
      }

      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?track_id=${trackId}&apikey=${this.apiKey}`
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string" || typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
            artistName
          )}&q_track=${encodeURIComponent(trackName)}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          const trackId: string =
            response.data.message.body.track_list[0].track.track_id;
          const lyricsResponse: AxiosResponse = await axios.get(
            `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?track_id=${trackId}&apikey=${this.apiKey}`
          );

          if (lyricsResponse.status === 200) {
            const subtitles: any = lyricsResponse.data.message.body.lyrics;
            return subtitles;
          } else {
            throw new MusixmatchError(
              this.handleStatusCode(lyricsResponse.status)
            );
          }
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (error: any) {
        throw new MusixmatchError(error.message);
      }
    }
  }

  /**
   *
   * @param {TrackIDType | {artistName: ArtistNameType, trackName: TrackNameType}} identifier
   * @returns {SubtitleReturnType} subtitle
   *
   * Get synced lyrics using this function.
   * ! Paid API Key is required.
   */

  async matcherSubtitlesGet(
    identifier:
      | TrackIDType
      | { artistName: ArtistNameType; trackName: TrackNameType }
  ): SubtitleReturnType {
    if (typeof identifier === "string") {
      const trackId = identifier;
      if (typeof trackId !== "string") {
        throw new MusixmatchTypeError(
          `Expected Type to be "string" but got ${typeof trackId} instead.`
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/matcher.subtitles.get?track_id=${trackId}&apikey=${this.apiKey}`
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
    } else {
      const { artistName, trackName } = identifier;
      if (typeof artistName !== "string" || typeof trackName !== "string") {
        throw new MusixmatchTypeError(
          `Expected artistName and trackName to be of type "string" but got ${typeof artistName} and ${typeof trackName} instead.`
        );
      }
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${encodeURIComponent(
            artistName
          )}&q_track=${encodeURIComponent(trackName)}&apikey=${this.apiKey}`
        );

        if (response.status === 200) {
          const trackId: string =
            response.data.message.body.track_list[0].track.track_id;
          const subtitleResponse: AxiosResponse = await axios.get(
            `https://api.musixmatch.com/ws/1.1/matcher.subtitles.get?track_id=${trackId}&apikey=${this.apiKey}`
          );

          if (subtitleResponse.status === 200) {
            const subtitles: any = subtitleResponse.data.message.body.subtitle;
            return subtitles;
          } else {
            throw new MusixmatchError(
              this.handleStatusCode(subtitleResponse.status)
            );
          }
        } else {
          throw new MusixmatchError(this.handleStatusCode(response.status));
        }
      } catch (error: any) {
        throw new MusixmatchError(error.message);
      }
    }
  }
}

export { MusixmatchAPI };
