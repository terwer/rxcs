const logUtils = require("./log-utils");

module.exports = {
    checkDuplicate(exitIfRunning, killOld) {
        const shouldExit = exitIfRunning !== false;
        const shouldKillOld = !!killOld;
        const currentEngine = engines.myEngine();
        const currentSrc = currentEngine.source.toString();

        const running = engines.all().filter(e => {
            return e.id !== currentEngine.id && e.source.toString() === currentSrc;
        });

        if (running.length < 1) {
            return false;
        }

        logUtils.warn(`duplicate engines: ${running.length}`);

        if (shouldKillOld) {
            running.forEach(e => {
                try {
                    e.forceStop();
                } catch (err) {
                    logUtils.warn(`stop old engine failed: ${err.message}`);
                }
            });
            sleep(800);
            return false;
        }

        if (shouldExit) {
            toast("脚本已在运行");
            sleep(1000);
            exit();
        }
        return true;
    },
};
