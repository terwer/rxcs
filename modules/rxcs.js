const config = require("./rxcs-config");
const logUtils = require("./log-utils");
const delayUtils = require("./delay-utils");
const actionUtils = require("./action-utils");
const login = require("./rxcs-login");
const server = require("./rxcs-server");

function selectorByClassAndText(classNameValue, textValue, timeoutMs) {
    return className(classNameValue).text(textValue).findOne(timeoutMs || 200);
}

module.exports = {
    run(isDev) {
        logUtils.setLevel(isDev ? logUtils.LEVELS.DEBUG : logUtils.LEVELS.INFO);
        logUtils.info("RXCS flow start", true);

        this.ensureAccessibility();
        this.ensureCapturePermission();

        this.launchApp();
        // 临时注释方便测试，全流程通了打开
        // this.handlePrivacyDialog();
        // if (this.handlePermissionDialog()) {
        //     logUtils.info("permission handled, relaunch app");
        //     this.launchApp();
        // }
        // this.handleNewVersionTip();
        let loginOk = true;
        if (config.login.enabled) {
            loginOk = login.run();
        }
        if (loginOk && config.server.enabled) {
            server.run();
        }

        logUtils.info("RXCS flow end", true);
    },

    ensureAccessibility() {
        if (!auto.service) {
            throw new Error("无障碍服务未开启");
        }
    },

    ensureCapturePermission() {
        if (!requestScreenCapture()) {
            logUtils.warn("screencap permission denied, image-based steps may be skipped", true);
            return false;
        }
        return true;
    },

    launchApp() {
        logUtils.info(`launch app: ${config.appPackage}`);
        home();
        delayUtils.afterHome();
        if (!app.launchPackage(config.appPackage)) {
            throw new Error(`launch package failed: ${config.appPackage}`);
        }
        delayUtils.afterLaunchApp();
    },

    handlePrivacyDialog() {
        let handled = false;
        for (let i = 0; i < 8; i++) {
            if (this.isPrivacyDialogShowing()) {
                const agreeBtn = selectorByClassAndText("android.widget.Button", "同意", 300);
                if (agreeBtn) {
                    actionUtils.clickUiObject(agreeBtn);
                    delayUtils.afterDialog();
                    handled = true;
                    break;
                }
            }
            sleep(1000);
        }
        logUtils.info(`privacy dialog ${handled ? "handled" : "not found"}`);
        return handled;
    },

    isPrivacyDialogShowing() {
        const titleNode = text("声明与条款").findOne(100);
        const agreeNode = selectorByClassAndText("android.widget.Button", "同意", 100);
        return !!(titleNode && agreeNode);
    },

    handlePermissionDialog() {
        let handled = false;
        let missCount = 0;

        for (let i = 0; i < 20; i++) {
            const btnText = this.findPermissionButtonText();
            if (btnText) {
                const btn = selectorByClassAndText("android.widget.Button", btnText, 200);
                if (btn) {
                    logUtils.info(`permission dialog found: ${btnText}`);
                    actionUtils.clickUiObject(btn);
                    delayUtils.afterDialog();
                    handled = true;
                    missCount = 0;
                    continue;
                }
            }

            missCount++;
            if (handled && missCount >= 3) {
                break;
            }
            sleep(800);
        }

        logUtils.info(`permission dialog ${handled ? "handled" : "not found"}`);
        return handled;
    },

    findPermissionButtonText() {
        for (let i = 0; i < config.permissionTexts.length; i++) {
            const textValue = config.permissionTexts[i];
            const btn = selectorByClassAndText("android.widget.Button", textValue, 80);
            if (btn) {
                return textValue;
            }
        }
        return "";
    },

    handleNewVersionTip() {
        if (!files.exists(config.assets.newVersionTip)) {
            logUtils.warn("assets/new_version_tip.png missing, skip version tip");
            return false;
        }

        if (!actionUtils.imageExists(config.assets.newVersionTip, {
            threshold: config.versionTipThreshold,
        })) {
            logUtils.info("new version tip not found");
            return false;
        }

        logUtils.info("new version tip found");

        if (!files.exists(config.assets.newVersionConfirm)) {
            logUtils.warn("assets/new_version_confirm.png missing, cannot auto click confirm yet", true);
            return true;
        }

        const clicked = actionUtils.clickPictureOnce(config.assets.newVersionConfirm, {
            threshold: config.versionTipThreshold,
        });

        logUtils.info(`new version confirm ${clicked ? "clicked" : "not found"}`);
        return clicked;
    },
};
