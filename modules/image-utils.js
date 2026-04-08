module.exports = {
    readImage(source) {
        return images.read(source);
    },
    safeRecycle(image) {
        if (!image) {
            return;
        }
        if (typeof image.recycle === "function") {
            try {
                if (typeof image.isRecycled === "function") {
                    if (!image.isRecycled()) {
                        image.recycle();
                    }
                } else {
                    image.recycle();
                }
            } catch (e) {
                // ignore recycle failures
            }
        }
    },
};
