import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';
import * as moment from 'moment';

const BASE_URL = 'https://www.googleapis.com/youtube/v3/';
const API_PARAMS = '&part=snippet%2CcontentDetails%2Cstatistics&key=';
const SEARCH_PARAMS = '&maxResults=10&type=video&part=snippet&key=';

@Injectable()
export class YoutubeService {

  constructor(private http: HttpClient) { }

  getVideoDetails(videoId: string): Observable<any> {
    return this.http.get<any>(this.buildYoutubeAPIUrl(videoId));
  }

  getVideoTitle(videoDetails: any): string {
    return _.get(videoDetails, 'items[0].snippet.localized.title', 'No Title');
  }

  getVideoLength(videoDetails: any): number {
    const duration = _.get(videoDetails, 'items[0].contentDetails.duration', 'PT0S');
    return moment.duration(duration).asMilliseconds();
  }

  search(searchString: string) {
    return this.http.get<any>(this.buildYoutubeAPIUrl(searchString, false));
  }

  private buildYoutubeAPIUrl(param: string, getDetails = true) {
    return BASE_URL + (getDetails ? 'videos?id=' : 'search?q=') + param + (getDetails ? API_PARAMS : SEARCH_PARAMS) + environment.apiKey;
  }
}
