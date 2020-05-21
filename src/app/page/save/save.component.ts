import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/page.model';
import { PageService } from '../page.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {
  public page: Page;
  constructor(private pageService: PageService) { }

  ngOnInit(): void {
    this.page = new Page();
  }

  onSubmit() {
    this.pageService.addPage(this.page);
  }
}
