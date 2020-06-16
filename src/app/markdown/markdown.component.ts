import marked, { Renderer } from 'marked';
import highlightjs from 'highlight.js';
import DOMPurify from 'dompurify';

import {
  Component, Input, OnChanges, SimpleChange, ViewEncapsulation, OnDestroy
} from '@angular/core';
import {
  DomSanitizer, SafeHtml
} from '@angular/platform-browser';
import { PageService } from '../page/page.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-markdown',
  template: '<div [innerHTML]="data"></div>',
  encapsulation: ViewEncapsulation.None,
  styles: [`.new { color: #ba0000 }`]
})
export class MarkdownComponent implements OnChanges {

  @Input() text: string;
  @Input() checkBrokenLinks: string;
  data: SafeHtml;
  md: any;

  static readonly InternalLink = "internalLink";
  static highlightCode(code: string, language: string): string {
    if (!(language && highlightjs.getLanguage(language))) {
      // use 'markdown' as default language
      language = 'markdown';
    }

    const result = highlightjs.highlight(language, code).value;
    return `<code class="hljs ${language}">${result}</code>`;
  }

  constructor(private sanitizer: DomSanitizer, private pageService: PageService) {
    const renderer = new Renderer();
    renderer.code = MarkdownComponent.highlightCode;

    const tokenizer = {
      link(src) {
        const match = src.match(/^\[\[((\w+\s*)+)\]\]/)
        if (match) {
          const text: string = match[1].trim();
          const id: string = text.replace(' ', '_').toLowerCase();
          return {
            type: 'link',
            raw: match[0],
            href:  environment.staticServerUrl + "/page/" + id,
            title: `${text}" class="${MarkdownComponent.InternalLink} ${id}"`,
            text: text
          }
        }
        return false;
      }
    };
    marked.use({ renderer, tokenizer, breaks: true, gfm: true });
    this.md = marked;
  }

  async markdownToSafeHtml(value: string): Promise<SafeHtml> {
    const html = this.md(value);
    let safeHtml = DOMPurify.sanitize(html);
    if (this.checkBrokenLinks) {
      const safe = await this.handleBrokenLinks(safeHtml);
        return this.sanitizer.bypassSecurityTrustHtml(safe);
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
    }
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'text') {
        const value = changes[propName].currentValue;
        this.data = await this.markdownToSafeHtml(value ?? '');
      }
    }
  }

  async handleBrokenLinks(html: string) {
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(html, 'text/html');
    const internalLinks = parsedHtml.getElementsByClassName(MarkdownComponent.InternalLink);
    let ids = [];
    for (let index = 0; index < internalLinks.length; index++) {
      const element = internalLinks[index];
      ids.push(element.classList[1]);
    }

    let pages = await this.pageService.searchPages(null, ids).toPromise();

    const nonExistingIds = ids.filter(id=> pages.findIndex(page=> page.id.toLowerCase() === id) === -1)

    for (const id of nonExistingIds) {
      let brokenLink = parsedHtml.querySelector(`.${MarkdownComponent.InternalLink}.${id.toLowerCase()}`);
      brokenLink.classList.remove(MarkdownComponent.InternalLink);
      brokenLink.classList.add("new");
    }
    return parsedHtml.documentElement.innerHTML;
  }
}
