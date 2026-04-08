const LEVELS = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
};

let currentLevel = LEVELS.INFO;

function setLevel(level) {
    if (Object.values(LEVELS).indexOf(level) === -1) {
        throw new Error("invalid log level");
    }
    currentLevel = level;
}

function print(prefix, message, forceToast) {
    console.log(`${prefix} ${message}`);
    if (forceToast) {
        toast(message);
    }
}

module.exports = {
    LEVELS,
    get currentLevel() {
        return currentLevel;
    },
    setLevel,
    trace(message, forceToast) {
        if (LEVELS.TRACE >= currentLevel) {
            print("[trace]", message, forceToast);
        }
    },
    debug(message, forceToast) {
        if (LEVELS.DEBUG >= currentLevel) {
            print("[debug]", message, forceToast);
        }
    },
    info(message, forceToast) {
        if (LEVELS.INFO >= currentLevel) {
            print("[info]", message, forceToast);
        }
    },
    warn(message, forceToast) {
        if (LEVELS.WARN >= currentLevel) {
            print("[warn]", message, forceToast);
        }
    },
    error(message, forceToast) {
        if (LEVELS.ERROR >= currentLevel) {
            print("[error]", message, true || forceToast);
        }
    },
};
