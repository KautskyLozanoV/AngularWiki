import { Component, OnInit } from '@angular/core';
import { PageService } from '../page/page.service';
import { Page } from '../page.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public search: string;
  public results: Page[] = [];

  constructor(private pageSerivce: PageService) { }

  onSubmit(){
    this.pageSerivce.searchPages(this.search, null).subscribe(data => {
      this.results = data;
    });
  }

  ngOnInit(): void {
  }

}
