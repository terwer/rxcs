const instanceGuard = require('./modules/instance-guard');
const rxcs = require('./modules/rxcs');

instanceGuard.checkDuplicate(true, true);
rxcs.run(true);
