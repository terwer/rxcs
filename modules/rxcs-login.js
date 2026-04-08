const config = require("./rxcs-config");
const logUtils = require("./log-utils");
const delayUtils = require("./delay-utils");
const actionUtils = require("./action-utils");

function findById(idValue, timeoutMs) {
    return id(idValue).findOne(timeoutMs || config.login.timeouts.node);
}

function textOf(node) {
    if (!node) {
        return "{not_found}";
    }
    try {
        const textValue = node.text();
        if (textValue === null || textValue === undefined) {
            return "";
        }
        return String(textValue);
    } catch (e) {
        return "{read_error}";
    }
}

function exists(templatePath, threshold) {
    if (!files.exists(templatePath)) {
        return false;
    }
    return actionUtils.imageExists(templatePath, {
        threshold: threshold || 0.8,
    });
}

module.exports = {
    run() {
        const mode = config.login.mode;
        logUtils.info(`login mode: ${mode}`);

        switch (mode) {
            case "login_page_ready":
                return this.testPageReady();
            case "login_input_user_only":
                return this.testInputUserOnly();
            case "login_input_pwd_only":
                return this.testInputPwdOnly();
            case "login_agree_only":
                return this.testAgreeOnly();
            case "login_click_only":
                return this.testClickOnly();
            case "login_full":
                return this.runFull();
            default:
                logUtils.warn(`unknown login mode: ${mode}`);
                return false;
        }
    },

    runFull() {
        if (!this.isPageReady()) {
            logUtils.error("login page not ready");
            return false;
        }
        if (!config.login.account) {
            logUtils.error("login account empty");
            return false;
        }
        if (!config.login.password) {
            logUtils.error("login password empty");
            return false;
        }

        if (!this.inputUser(config.login.account)) {
            logUtils.error("login user input failed");
            return false;
        }
        if (!this.inputPassword(config.login.password)) {
            logUtils.error("login password input failed");
            return false;
        }
        if (!this.ensureAgreement()) {
            logUtils.error("login agreement failed");
            return false;
        }
        if (!this.clickLogin()) {
            logUtils.error("login button click failed");
            return false;
        }
        if (!this.verifyLoginResult()) {
            logUtils.error("login result verify failed");
            return false;
        }
        logUtils.info("login full success", true);
        return true;
    },

    isPageReady() {
        const ready = delayUtils.waitFor(() => {
            return !!findById(config.login.ids.userInput, 100) &&
                !!findById(config.login.ids.pwdInput, 100) &&
                !!findById(config.login.ids.loginButton, 100);
        }, config.login.timeouts.pageReady, 300);

        logUtils.info(`login page ready: ${ready}`);
        return ready;
    },

    snapshot(tag) {
        const userNode = findById(config.login.ids.userInput, 100);
        const pwdNode = findById(config.login.ids.pwdInput, 100);
        const userText = textOf(userNode);
        const pwdText = textOf(pwdNode);
        logUtils.debug(`snapshot[${tag}] user=${userText}, pwd=${pwdText}`);
        return {
            userText,
            pwdText,
        };
    },

    inputUser(value) {
        return this.inputField(
            config.login.ids.userInput,
            config.login.ids.pwdInput,
            config.login.placeholders.user,
            value,
            "user"
        );
    },

    inputPassword(value) {
        return this.inputField(
            config.login.ids.pwdInput,
            config.login.ids.userInput,
            config.login.placeholders.pwd,
            value,
            "pwd"
        );
    },

    inputField(targetId, otherId, placeholder, value, label) {
        const before = this.snapshot(`${label}_before`);
        const targetNode = findById(targetId);
        const otherNode = findById(otherId);

        if (!targetNode || !otherNode) {
            logUtils.warn(`${label}: target or other node missing`);
            return false;
        }

        const clicked = actionUtils.clickUiObject(targetNode);
        delayUtils.afterClick();
        if (!clicked) {
            logUtils.warn(`${label}: click target failed`);
            return false;
        }

        if (typeof targetNode.setText === "function") {
            try {
                targetNode.setText(value);
            } catch (e) {
                logUtils.warn(`${label}: node.setText failed: ${e.message}`);
                return false;
            }
        } else {
            logUtils.warn(`${label}: node.setText unavailable`);
            return false;
        }

        sleep(config.login.timeouts.afterInput);

        const after = this.snapshot(`${label}_after`);
        if (label === "user") {
            if (after.userText === before.userText || after.userText === placeholder) {
                logUtils.warn("user: target unchanged");
                return false;
            }
            if (after.pwdText !== before.pwdText) {
                logUtils.warn("user: other field polluted");
                return false;
            }
            return true;
        }

        if (after.pwdText === before.pwdText || after.pwdText === placeholder) {
            logUtils.warn("pwd: target unchanged");
            return false;
        }
        if (after.userText !== before.userText) {
            logUtils.warn("pwd: other field polluted");
            return false;
        }
        return true;
    },

    ensureAgreement() {
        if (exists(config.assets.agreeYes, 0.8)) {
            logUtils.info("agreement already checked");
            return true;
        }

        if (!files.exists(config.assets.agreeNo) || !files.exists(config.assets.agreeYes)) {
            logUtils.warn("agreement assets missing");
            return false;
        }

        const clicked = actionUtils.clickPictureOnce(config.assets.agreeNo, { threshold: 0.8 });
        delayUtils.afterClick();
        if (!clicked) {
            logUtils.warn("agreement no-state not found");
            return false;
        }

        const checked = delayUtils.waitFor(() => exists(config.assets.agreeYes, 0.8), 3000, 300);
        logUtils.info(`agreement checked: ${checked}`);
        return checked;
    },

    clickLogin() {
        const btn = findById(config.login.ids.loginButton);
        if (!btn) {
            return false;
        }
        const clicked = actionUtils.clickUiObject(btn);
        delayUtils.afterClick();
        return clicked;
    },

    verifyLoginResult() {
        const result = delayUtils.waitFor(() => {
            return !findById(config.login.ids.userInput, 100) &&
                !findById(config.login.ids.pwdInput, 100) &&
                !findById(config.login.ids.loginButton, 100);
        }, 5000, 400);
        logUtils.info(`login result changed: ${result}`);
        return result;
    },

    testPageReady() {
        return this.isPageReady();
    },

    testInputUserOnly() {
        if (!this.isPageReady()) {
            return false;
        }
        if (!config.login.account) {
            logUtils.warn("test user: account empty");
            return false;
        }
        return this.inputUser(config.login.account);
    },

    testInputPwdOnly() {
        if (!this.isPageReady()) {
            return false;
        }
        if (!config.login.password) {
            logUtils.warn("test pwd: password empty");
            return false;
        }
        return this.inputPassword(config.login.password);
    },

    testAgreeOnly() {
        if (!this.isPageReady()) {
            return false;
        }
        return this.ensureAgreement();
    },

    testClickOnly() {
        if (!this.isPageReady()) {
            return false;
        }
        return this.clickLogin();
    },
};
