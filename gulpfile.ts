import path from 'path';
import { parallel, series } from 'gulp';
import { allSubDirsForLevel, svgFilesUnder } from './gulp/utils';
import { reactTask } from './packages/react/gulp/index';

const singleColorIconDirs = allSubDirsForLevel(path.resolve(__dirname, 'svg/single'), 1).map(p => svgFilesUnder(p));
const binaryColorIconDirs = allSubDirsForLevel(path.resolve(__dirname, 'svg/binary'), 1).map(p => svgFilesUnder(p));
const nonSingleColorIconDirs = allSubDirsForLevel(path.resolve(__dirname, 'svg/other'), 1).map(p => svgFilesUnder(p));
const v4SingleIconDirs  = allSubDirsForLevel(path.resolve(__dirname, 'svg/v4/single'), 0).map(p => svgFilesUnder(p));
const v4DoubleIconDirs  = allSubDirsForLevel(path.resolve(__dirname, 'svg/v4/double'), 0).map(p => svgFilesUnder(p));
const v4OtherIconDirs  = allSubDirsForLevel(path.resolve(__dirname, 'svg/v4/other'), 0).map(p => svgFilesUnder(p));

// React Only.
// TODO: Add Vue and SVG tasks.
export default series(
    parallel(
        reactTask(
            singleColorIconDirs, 
            binaryColorIconDirs, 
            nonSingleColorIconDirs, 
            v4SingleIconDirs,
            v4DoubleIconDirs,
            v4OtherIconDirs
        ),
    )
);