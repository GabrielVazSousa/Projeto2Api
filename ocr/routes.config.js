const OcrController = require('./controllers/ocr.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

exports.routesConfig = function (app) {
    app.post('/ocr', upload.single('file'), [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        OcrController.ConvertImageToText
    ]);
    app.get('/ocr', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        OcrController.list
    ]);
    app.get('/ocr/:ocrId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        OcrController.getById
    ]);
};
