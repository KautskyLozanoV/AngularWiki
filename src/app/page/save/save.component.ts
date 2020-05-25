import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from 'src/app/page.model';
import { PageService } from '../page.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit, OnDestroy {
  public page: Page;
  pageSub: Subscription;

  constructor(private pageService: PageService, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.pageSub.unsubscribe();
  }

  ngOnInit(): void {
    this.page = new Page();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        let id = paramMap.get('id');
        this.pageSub = this.pageService.getPage(id)
          .subscribe(page => this.page = page, error => {
            this.page = {
              title: id.replace('_', ' '),
              content: null,
              id: null,
              imagePath: null,
              changeDescription: null,
            };
          });
      }
    });

  }

  onSubmit() {
    if (this.page.id)
      this.pageService.updatePage(this.page);
    else
      this.pageService.addPage(this.page);
  }
}
