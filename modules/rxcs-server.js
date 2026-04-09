const config = require("./rxcs-config");
const logUtils = require("./log-utils");
const delayUtils = require("./delay-utils");
const actionUtils = require("./action-utils");

function assetExists(assetPath) {
    return !!assetPath && files.exists(assetPath);
}

function imageExists(assetPath) {
    if (!assetExists(assetPath)) {
        return false;
    }
    return actionUtils.imageExists(assetPath, {
        threshold: config.server.threshold,
    });
}

module.exports = {
    run() {
        const mode = config.server.mode;
        logUtils.info(`server mode: ${mode}`);

        switch (mode) {
            case "server_page_ready":
                return this.testPageReady();
            case "server_click_green_entry_only":
                return this.testClickGreenEntryOnly();
            case "server_click_server_select_only":
                return this.testClickServerSelectOnly();
            case "server_click_group_1_10_only":
                return this.testClickGroup1To10Only();
            case "server_click_huai_1_only":
            case "server_click_green_zone_only":
                return this.testClickHuai1Only();
            case "server_click_enter_game_only":
                return this.testClickEnterGameOnly();
            case "server_full":
                return this.runFull();
            default:
                logUtils.warn(`unknown server mode: ${mode}`);
                return false;
        }
    },

    isPageReady() {
        if (!assetExists(config.server.assets.greenEntryPageReady)) {
            logUtils.warn("server green entry page ready asset missing");
            return false;
        }
        const ready = delayUtils.waitFor(() => {
            return imageExists(config.server.assets.greenEntryPageReady);
        }, config.server.timeouts.pageReady, 300);
        logUtils.info(`server page ready: ${ready}`);
        return ready;
    },

    isServerSelectPageReady() {
        if (!assetExists(config.server.assets.serverSelectPageReady)) {
            logUtils.warn("server select page ready asset missing");
            return false;
        }
        const ready = delayUtils.waitFor(() => {
            return imageExists(config.server.assets.serverSelectPageReady);
        }, config.server.timeouts.pageReady, 300);
        logUtils.info(`server select page ready: ${ready}`);
        return ready;
    },

    isGroupPageReady() {
        if (!assetExists(config.server.assets.group1To10)) {
            logUtils.warn("server group 1-10 asset missing");
            return false;
        }
        const ready = delayUtils.waitFor(() => {
            return imageExists(config.server.assets.group1To10);
        }, config.server.timeouts.pageReady, 300);
        logUtils.info(`server group page ready: ${ready}`);
        return ready;
    },

    isZonePageReady() {
        if (!assetExists(config.server.assets.zoneHuai1)) {
            logUtils.warn("server huai 1 asset missing");
            return false;
        }
        const ready = delayUtils.waitFor(() => {
            return imageExists(config.server.assets.zoneHuai1);
        }, config.server.timeouts.pageReady, 300);
        logUtils.info(`server zone page ready: ${ready}`);
        return ready;
    },

    clickGreenEntry() {
        if (!assetExists(config.server.assets.greenEntry)) {
            logUtils.warn("server green entry asset missing");
            return false;
        }
        const clicked = actionUtils.clickPictureOnce(config.server.assets.greenEntry, {
            threshold: config.server.threshold,
        });
        delayUtils.afterClick();
        logUtils.info(`server green entry clicked: ${clicked}`);
        return clicked;
    },

    clickGroup1To10() {
        if (!assetExists(config.server.assets.group1To10)) {
            logUtils.warn("server group 1-10 asset missing");
            return false;
        }
        const clicked = actionUtils.clickPictureOnce(config.server.assets.group1To10, {
            threshold: config.server.threshold,
        });
        delayUtils.afterClick();
        logUtils.info(`server group 1-10 clicked: ${clicked}`);
        return clicked;
    },

    clickHuai1() {
        if (!assetExists(config.server.assets.zoneHuai1)) {
            logUtils.warn("server huai 1 asset missing");
            return false;
        }
        const clicked = actionUtils.clickPictureOnce(config.server.assets.zoneHuai1, {
            threshold: config.server.threshold,
        });
        delayUtils.afterClick();
        logUtils.info(`server huai 1 clicked: ${clicked}`);
        return clicked;
    },

    clickServerSelectEntry() {
        if (!assetExists(config.server.assets.serverSelectEntry)) {
            logUtils.warn("server select entry asset missing");
            return false;
        }
        const clicked = actionUtils.clickPictureOnce(config.server.assets.serverSelectEntry, {
            threshold: config.server.threshold,
        });
        delayUtils.afterClick();
        logUtils.info(`server select entry clicked: ${clicked}`);
        return clicked;
    },

    isCurrentTargetZone() {
        if (!assetExists(config.server.assets.currentHuai1)) {
            logUtils.warn("server current huai 1 asset missing, fallback to manual selection path");
            return false;
        }
        const matched = imageExists(config.server.assets.currentHuai1);
        logUtils.info(`server current target zone matched: ${matched}`);
        return matched;
    },

    clickEnterGame() {
        if (!assetExists(config.server.assets.enterGame)) {
            logUtils.warn("server enter game asset missing");
            return false;
        }
        const clicked = actionUtils.clickPictureOnce(config.server.assets.enterGame, {
            threshold: config.server.threshold,
        });
        delayUtils.afterClick();
        logUtils.info(`server enter game clicked: ${clicked}`);
        return clicked;
    },

    verifySelectionResult() {
        const selectedAsset = config.server.assets.zoneHuai1Selected;
        const resultAsset = config.server.assets.serverResult;

        const ok = delayUtils.waitFor(() => {
            return (assetExists(selectedAsset) && imageExists(selectedAsset)) ||
                (assetExists(resultAsset) && imageExists(resultAsset));
        }, config.server.timeouts.result, 400);

        logUtils.info(`server result changed: ${ok}`);
        return ok;
    },

    runFull() {
        if (!this.isPageReady()) {
            logUtils.error("server page not ready");
            return false;
        }
        if (!this.clickGreenEntry()) {
            logUtils.error("server green entry failed");
            return false;
        }
        if (!this.isServerSelectPageReady()) {
            logUtils.error("server select page not ready");
            return false;
        }

        if (!this.isCurrentTargetZone()) {
            if (!this.clickServerSelectEntry()) {
                logUtils.error("server select entry failed");
                return false;
            }
            if (!this.isGroupPageReady()) {
                logUtils.error("server group page not ready");
                return false;
            }
            if (!this.clickGroup1To10()) {
                logUtils.error("server group 1-10 failed");
                return false;
            }
            if (!this.isZonePageReady()) {
                logUtils.error("server zone page not ready");
                return false;
            }
            if (!this.clickHuai1()) {
                logUtils.error("server huai 1 failed");
                return false;
            }
        } else {
            logUtils.info("server target already selected, skip server selection");
        }

        if (!this.clickEnterGame()) {
            logUtils.error("server enter game failed");
            return false;
        }
        if (!this.verifySelectionResult()) {
            logUtils.error("server result verify failed");
            return false;
        }
        logUtils.info("server full success", true);
        return true;
    },

    testPageReady() {
        return this.isPageReady();
    },

    testClickGreenEntryOnly() {
        if (!this.isPageReady()) {
            return false;
        }
        return this.clickGreenEntry();
    },

    testClickServerSelectOnly() {
        if (!this.isServerSelectPageReady()) {
            return false;
        }
        return this.clickServerSelectEntry();
    },

    testClickGroup1To10Only() {
        if (!this.isGroupPageReady()) {
            return false;
        }
        return this.clickGroup1To10();
    },

    testClickHuai1Only() {
        if (!this.isZonePageReady()) {
            return false;
        }
        return this.clickHuai1();
    },

    testClickEnterGameOnly() {
        if (!assetExists(config.server.assets.enterGame)) {
            logUtils.warn("server enter game asset missing");
            return false;
        }
        return this.clickEnterGame();
    },
};
