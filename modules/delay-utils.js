const logUtils = require("./log-utils");

module.exports = {
    getDelay() {
        if (logUtils.currentLevel <= logUtils.LEVELS.DEBUG) {
            return 2500;
        }
        return 1500;
    },
    sleep(intervalMs) {
        sleep(intervalMs || this.getDelay());
    },
    waitFor(conditionFn, timeoutMs, intervalMs) {
        const timeout = timeoutMs || 10000;
        const interval = intervalMs || 400;
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (conditionFn()) {
                return true;
            }
            sleep(interval);
        }
        return false;
    },
    afterClick() {
        this.sleep(1200);
    },
    afterDialog() {
        this.sleep(1000);
    },
    afterHome() {
        this.sleep(1800);
    },
    afterLaunchApp() {
        this.sleep(5000);
    },
};
