import * as marked from 'marked';
import { Parser } from 'htmlparser2';
import * as jsdom from 'jsdom';
import { Css } from './css';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { FileSystem } from './file-system';


export class Markdown {
    public static JSDom: jsdom.JSDOM;
    public static HtmlDocument: HTMLDocument; 

    public readMarkdownFile(filePath: string, onMarkdownFileRead: Function): void {
        new FileSystem().readFileStream(filePath, onMarkdownFileRead);
    }

    public convertToHtml(markdownData: string, style: string): string {
        try {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false,
                highlight:
                    function (code) {
                        return require('highlight.js').highlightAuto(code).value;
                    },
                pedantic: false,
                renderer: new marked.Renderer(),
                sanitize: false,
                silent: true,
                smartLists: true,
                smartypants: true,
                tables: true,
                xhtml: true,
            });
            console.debug('HTML Output', marked(markdownData));
            Markdown.JSDom = new jsdom.JSDOM(marked(markdownData));
            Markdown.HtmlDocument = Markdown.JSDom.window.document;

            // Assign hljs class to PRE tags. 
            //const preTags = Markdown.HtmlDocument.getElementsByTagName('pre');
            //for (let x = 0; x < preTags.length; x++) {
            //    preTags.item(x).className = 'hljs';
            //}
            
            return this.findCssFile(style);
        }
        catch (e) {
            console.error(e);
        }
    }

    public findCssFile(style: string): string {
        console.debug('adding css...');

        try {
            const fileSystem = new FileSystem();
            const htmlStyle = Markdown.HtmlDocument.createElement('style');

            htmlStyle.innerHTML = fileSystem.readFileSync(`./styles/${style}.css`);
            Markdown.HtmlDocument.head.appendChild(htmlStyle);

            return Markdown.JSDom.serialize();
        } catch (e) {
            console.debug(e);
        }
    }

    public onCssFileRead(cssFileData: string) {
        const htmlStyle = Markdown.HtmlDocument.createElement('style');
        htmlStyle.innerHTML = cssFileData;
        Markdown.HtmlDocument.head.appendChild(htmlStyle);
    }
}