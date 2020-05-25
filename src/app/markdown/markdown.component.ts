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

@Component({
  selector: 'app-markdown',
  template: '<pre [innerHTML]="data"></pre>',
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
          const text = match[1].trim();
          const id = text.replace(' ', '_');
          return {
            type: 'link',
            raw: match[0],
            href: "http://localhost:4200/page/" + id,
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

  markdownToSafeHtml(value: string): SafeHtml {
    const html = this.md(value);
    let safeHtml = DOMPurify.sanitize(html);
    if (this.checkBrokenLinks) {
      this.handleBrokenLinks(safeHtml).then(html => {
        return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
      });
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'text') {
        const value = changes[propName].currentValue;
        this.data = this.markdownToSafeHtml(value ?? '');
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

    let data = await this.pageService.getPages(ids);
    console.log(data)
    for (let index = 0; index < data.length; index++) {
      let element = data[index];
      let brokenLink = parsedHtml.querySelector(`.${MarkdownComponent.InternalLink}.${element}`);
      brokenLink.classList.remove(MarkdownComponent.InternalLink);
      brokenLink.classList.add("new");
    }

    return parsedHtml.documentElement.innerHTML;
  }
}
