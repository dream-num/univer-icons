import fs from 'fs-extra';
import path from 'path';
import camelCase from 'camelcase';
import del from 'del';

export function allSubDirsForLevel(rootPath: string, level: number): string[] {
    let currentLoads: string[] = [rootPath];
    let nextLoads: string[] = [];
    let currentLevel = 0;

    while (true) {
        if (currentLevel === level) {
            return currentLoads;
        }

        if (currentLoads.length) {
            const cur = currentLoads.shift()!;
            const subDir = fs.readdirSync(cur).map(child => path.resolve(cur, child)).filter(child => fs.statSync(child).isDirectory());
            nextLoads.push(...subDir);
        } else {
            currentLoads = nextLoads;
            nextLoads = [];
            currentLevel += 1;
        }
    }
}

export function upperCamelCase(str: string): string {
    const cased = camelCase.apply(camelCase, arguments);
    return cased.charAt(0).toUpperCase() + cased.slice(1);
}

export function svgFilesUnder(path: string): string {
    return path + '/*.svg';
}

export const clearDir = (dirs: string[]) => () => del(dirs);