module.exports = {
    appPackage: "com.sjgwer.dbbyh",
    appName: "热血传说",
    assets: {
        newVersionTip: "./assets/new_version_tip.png",
        newVersionConfirm: "./assets/new_version_confirm.png",
        loginButton: "./assets/login_btn.png",
        agreeNo: "./assets/agree_no.png",
        agreeYes: "./assets/agree_yes.png",
    },
    permissionTexts: [
        "允许",
        "始终允许",
        "仅在使用中允许",
        "继续允许",
    ],
    versionTipThreshold: 0.8,
    login: {
        enabled: true,
        mode: "login_full",
        account: "we7070015",
        password: "756458",
        ids: {
            userInput: "huanyu_defaultlogin_et_user",
            pwdInput: "huanyu_defaultlogin_et_pwd",
            loginButton: "huanyu_defaultlogin_bt_login",
        },
        placeholders: {
            user: "请输入用户名",
            pwd: "请输入密码",
        },
        timeouts: {
            pageReady: 5000,
            node: 1200,
            afterInput: 1000,
            afterClick: 800,
        },
    },
    debug: {
        screenshotEnabled: true,
    },
};
