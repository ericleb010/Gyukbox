import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import * as _ from 'lodash';
import * as moment from 'moment';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3/videos?id=';
const API_PARAMS = '&part=snippet%2CcontentDetails%2Cstatistics&key=';

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

  private buildYoutubeAPIUrl(videoId: string) {
    return API_BASE_URL + videoId + API_PARAMS + environment.apiKey;
  }
}
