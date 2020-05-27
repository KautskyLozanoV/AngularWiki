import { Component, OnInit } from '@angular/core';
import { Page } from '../page.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from '../page/page.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private pageService: PageService) { }
  public history: Page[];
  public title: string;
  pageSub: Subscription;
  displayedColumns: string[] = ['changeDescription', 'timestamp', 'diff'];
  ngOnInit(): void {
    this.history = [];

    this.route.queryParamMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('title')) {
        this.title = paramMap.get('title');
      }
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        let id = paramMap.get('id');
        this.pageSub = this.pageService.getPageHistory(id)
          .subscribe(pageHistory => this.history = pageHistory);
      }
    });
  }

}
