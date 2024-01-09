import { dest, src } from "gulp";
import rename from "gulp-rename";
import { svgo, SVGOConfig } from "./svgo";
import { svgToElement, NormalizationOptions } from "./svg-info-check";
import { useTemplate, IconFileContentGenerator } from "./useTemplate";

interface IGenerateIconOptions {
    from: string[];
    to: string;
    iconGenerator: IconFileContentGenerator;
    options?: NormalizationOptions;
    extName?: string;
    config?: SVGOConfig;
}

export const generateIcons = ({
    from,
    to,
    iconGenerator,
    options,
    extName = '.tsx',
    config,
}: IGenerateIconOptions) => function generateIcons() {
    return src(from)
    .pipe(svgo(config))
    .pipe(svgToElement(options))
    .pipe(useTemplate(iconGenerator))
    .pipe(rename((file) => {
        if (file.basename) {
            file.extname = extName;
        }
    }))
    .pipe(dest(to));
}