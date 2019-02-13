import * as fs from 'fs';
import { Buffer } from 'buffer';

export class FileSystem {

    public readFileStream(filePath: string, callbackFunction: Function): void {
        let fileData: string = '';

        if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath)
                .on('data', (chunk) => {
                    fileData += Buffer.from(chunk);
                })
                .on('end', () => {
                    callbackFunction(fileData.toString());
                });
        } else {
            console.error(`FileSystem.readFile(): ${filePath} does not exist.`);
        }
    }

    public readFileSync(filePath: string): string {
        return fs.readFileSync(filePath).toString();
    }

    public findFiles(filePath, ext: string): string[] {
        console.debug('filePath()', filePath);

        let cssFiles: string[] = [];

        try {
            const files: string[] = fs.readdirSync(filePath, { encoding: 'utf8' });

            files.forEach(file => {
                console.debug('css file', file.endsWith(ext));
                if (file.endsWith(ext)) {
                    cssFiles.push(file);
                }
                console.debug('css file', file.endsWith(ext));
            });
        } catch (e) {
            console.error('findFiles()', e);
        }

        return cssFiles;
    }
}