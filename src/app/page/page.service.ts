import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Page } from '../page.model';

@Injectable({ providedIn: 'root' })
export class PageService {
  private url = "http://localhost:3000/api/pages/";
  private posts: Page[] = [];
  private postsUpdated = new Subject<{ posts: Page[], total: number }>();

  constructor(private http: HttpClient, private router: Router) { }


  getPage(id: string) {
    return this.http.get<Page>(this.url + id);
  }

  searchPages(searchQuery: string) {
    return this.http.get<Page[]>(this.url + '?query=' + searchQuery);
  }

  addPage(page: Page){
    this.http.post<Page>(this.url, page)
    .subscribe(data => {
      this.router.navigate(["page/" + data.id])
    })
  }

}
