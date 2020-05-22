import marked, { Renderer } from 'marked';
import highlightjs from 'highlight.js';
import DOMPurify from 'dompurify';

import {
    Component, Input, OnChanges, SimpleChange, ViewEncapsulation
} from '@angular/core';
import {
    DomSanitizer, SafeHtml
} from '@angular/platform-browser';

@Component({
    selector: 'app-markdown',
    template: '<pre [innerHTML]="data"></pre>',
    encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent implements OnChanges {

    @Input() text: string;
    data: SafeHtml;
    md: any;

    static highlightCode(code: string, language: string): string {
        if (!(language && highlightjs.getLanguage(language))) {
             // use 'markdown' as default language
            language = 'markdown';
        }

        const result = highlightjs.highlight(language, code).value;
        return `<code class="hljs ${language}">${result}</code>`;
    }

    constructor(private sanitizer: DomSanitizer) {
        const renderer = new Renderer();
        renderer.code = MarkdownComponent.highlightCode;
        const tokenizer = {
          link(src) {
            const match = src.match(/^\[\[(\w)+\]\]$/)

            if (match) {
            console.log('matched')

              return {
                type: 'link',
                raw: match[0],
                href: "http://localhost:4200/page/" + match[1].replace(' ', '_'),
                title: null,
                text: match[1].trim()
              }
            }
            return false;
          }
        };
        marked.use({ renderer, tokenizer });
        this.md = marked;
    }

    markdownToSafeHtml(value: string): SafeHtml {
        const html = this.md(value);
        const safeHtml = DOMPurify.sanitize(html);
        return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName === 'text') {
                const value = changes[propName].currentValue;
                if (value) {
                    this.data = this.markdownToSafeHtml(value);
                }
            }
        }
    }
}
