import { Component, EventEmitter, Output } from '@angular/core';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'gyukbox-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() songAdded = new EventEmitter<string>();

  searchString = '';
  searchResults = {};

  constructor(private youtubeService: YoutubeService) { }

  search() {
    this.youtubeService.search(this.searchString).subscribe(data => {
      this.searchResults = data;
    });
  }

  addSong(videoId: string) {
    this.songAdded.emit(videoId);
  }

}
