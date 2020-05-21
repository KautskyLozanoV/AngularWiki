import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { PageComponent } from './page/page.component';
import { DiffComponent } from './diff/diff.component';
import { HistoryComponent } from './history/history.component'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { SaveComponent } from './page/save/save.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { DemoComponent } from './demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    PageComponent,
    DiffComponent,
    HistoryComponent,
    SaveComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          tokenizer: {
            link(src) {
              const match = src.match(/^\[\[(\w)+\]\]$/);
              if (match) {
                return {
                  type: 'link',
                  raw: match[0],
                  href: '',
                  title: null,
                  text: match[1].trim()
                };
              }
              return false;
            }
          }
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
