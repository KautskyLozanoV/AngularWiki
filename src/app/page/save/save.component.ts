import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from 'src/app/page.model';
import { PageService } from '../page.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit, OnDestroy {
  public page: Page;
  pageSub: Subscription;

  constructor(private pageService: PageService, private route: ActivatedRoute, private http: HttpClient) { }
  ngOnDestroy(): void {
    this.pageSub?.unsubscribe();
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
              modifiedReason: null,
            };
          });
      }
    });

  }

  onSubmit(form: NgForm) {
    if (form.invalid)
      return;
    if (this.page.id)
      this.pageService.updatePage(this.page);
    else
      this.pageService.addPage(this.page);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // upload
    const postData = new FormData();
    const name = file.name.replace(' ', '_');
    postData.append('image', file, name)
    this.http.post(environment.apiUrl + "images/", postData).subscribe((img: any) => {
      const title = name.substring(0, name.lastIndexOf('.'));

      this.page.content += `\n\n![alt text][${title}]\n\n[${title}]: ${img.imagePath}`;
    })
  }
}
