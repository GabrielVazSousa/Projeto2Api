const BarcodeController = require('./controllers/barcode.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

var multer  = require('multer')
var upload = multer({ dest: 'uploadsBarcodes/' })

exports.routesConfig = function (app) {
    app.post('/barcode', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        BarcodeController.ConvertStringToBarcode
    ]);
    app.get('/barcode', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        BarcodeController.list
    ]);
    // app.get('/ocr/:ocrId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    //     BarcodeController.getById
    // ]);
};
