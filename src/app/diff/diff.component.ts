import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from '../page/page.service';
import { Page } from '../page.model';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit, OnDestroy {
  left: Page;
  right: Page;

  leftSub: Subscription;
  rightSub: Subscription;
  id: string;

  constructor(private route: ActivatedRoute, private pageService: PageService) { }
  ngOnDestroy(): void {
    this.leftSub.unsubscribe();
    this.rightSub.unsubscribe();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id');

      const version = paramMap.get('version');
      this.leftSub = this.pageService.getPageVersion(this.id, version)
        .subscribe(page => {
          this.left = page;
        })

      this.rightSub = this.pageService.getPageVersion(this.id, version, true)
        .subscribe(page => {
          this.right = page;
        })
    })
  }

}
