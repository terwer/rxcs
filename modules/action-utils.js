const logUtils = require("./log-utils");
const imageUtils = require("./image-utils");

function centerOfMatch(point, image) {
    return {
        x: parseInt(point.x + image.getWidth() / 2),
        y: parseInt(point.y + image.getHeight() / 2),
    };
}

module.exports = {
    click(x, y) {
        return click(x, y);
    },
    clickUiObject(node) {
        if (!node) {
            return false;
        }
        const bounds = node.bounds();
        return click(bounds.centerX(), bounds.centerY());
    },
    findImages(templatePath, options) {
        const opts = options || {};
        const threshold = opts.threshold !== undefined ? opts.threshold : 0.8;
        const max = opts.max !== undefined ? opts.max : 5;

        const screen = captureScreen();
        let template = null;
        try {
            template = imageUtils.readImage(templatePath);
            if (!template) {
                logUtils.warn(`template not found: ${templatePath}`);
                return [];
            }

            const result = images.matchTemplate(screen, template, {
                threshold: threshold,
                max: max,
            });
            if (!result || !result.points) {
                return [];
            }
            return result.points;
        } catch (e) {
            logUtils.error(`findImages failed: ${e.message}`);
            return [];
        } finally {
            imageUtils.safeRecycle(screen);
            imageUtils.safeRecycle(template);
        }
    },
    imageExists(templatePath, options) {
        return this.findImages(templatePath, options).length > 0;
    },
    clickPictureOnce(templatePath, options) {
        const opts = options || {};
        const threshold = opts.threshold !== undefined ? opts.threshold : 0.8;
        const points = this.findImages(templatePath, {
            threshold: threshold,
            max: 1,
        });
        if (points.length < 1) {
            return false;
        }

        let template = null;
        try {
            template = imageUtils.readImage(templatePath);
            if (!template) {
                return false;
            }
            const target = centerOfMatch(points[0], template);
            logUtils.debug(`clickPictureOnce: ${templatePath} -> ${target.x},${target.y}`);
            return click(target.x, target.y);
        } finally {
            imageUtils.safeRecycle(template);
        }
    },
};
