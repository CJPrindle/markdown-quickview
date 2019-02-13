import * as http from 'http';
import { Markdown } from './markdown';
import * as minimist2 from 'minimist2';

const args: any = minimist2(process.argv.slice(2));
const style: string = args.s ? args.s : args.style;
const markdown = new Markdown();
const markdownPath: string = args.m ? args.m : args.markdown;
const port = process.env.port || '1337';
let html = '';

main(); // Enter the Matrix

http.createServer(function (req, res) {
    console.debug('Server starting...');

    try {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }
    catch (e) {
        console.debug(e);
    }

    console.debug('Server running...');
}).listen(port)
    .on("error", err => {
        console.debug(err.stack);
    });

function main() {
    if (markdownPath && style) {
        markdown.readMarkdownFile(
            markdownPath,
            onMarkdownFileRead);
    } else {
        console.error(`Usage: ${__filename} requires a valid Markdown file and layout`);
        process.exit(-1);
    }
}

function onMarkdownFileRead(markdownFileData: string): void {
    console.debug('onMarkdownFileRead', style);
    html = markdown.convertToHtml(markdownFileData, style);
}