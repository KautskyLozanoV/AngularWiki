import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Page } from '../page.model';
import { version } from 'punycode';

@Injectable({ providedIn: 'root' })
export class PageService {
  private url = "http://localhost:3000/api/pages/";

  constructor(private http: HttpClient, private router: Router) { }

  getPage(id: string) {
    return this.http.get<Page>(this.url + id);
  }

  getPageVersion(id: string, version: string, next: boolean = false) {
    return this.http.get<Page>(`${this.url}${id}/version/${version}${next ? '/next' : ''}`);
  }

  getPageHistory(id: string) {
    return this.http.get<Page[]>(`${this.url}${id}/history`);
  }

  searchPages(searchQuery: string, ids: string[]) {
    return this.http.get<Page[]>(this.url + `?query=${searchQuery}&ids=${ids ?? ''}`);
  }

  addPage(page: Page) {
    this.http.post<Page>(this.url, page)
      .subscribe(data => {
        this.router.navigate(["page/" + data.id])
      })
  }

  updatePage(page: Page) {
    this.http.put<Page>(this.url, page)
      .subscribe(data => {
        this.router.navigate(["page/" + data.id])
      })
  }
}
