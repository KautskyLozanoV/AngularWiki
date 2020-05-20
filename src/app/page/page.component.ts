import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Page } from '../page.model';
import { PageService } from './page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, OnDestroy {
  public page: Page;
  pageSub: Subscription;


  constructor(public route: ActivatedRoute, private pageService: PageService) { }
  ngOnDestroy(): void {
    this.pageSub.unsubscribe();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        let id = paramMap.get('id');
        this.pageSub = this.pageService.getPage(id)
        .subscribe(page => this.page = page, error=> {
          this.page = {
            title: id.replace('_', ' '),
            content: null,
            id: null,
            imagePath: null,
            changeDescription: null,
          };
        });
      } else {
        this.page = {
          title: 'mock title',
          content: 'mock content',
          id: 'mockid',
          imagePath: 'mock',
          changeDescription: 'mock'
        };
      }
    });
  }

}
