const BarcodeModel = require('../models/barcode.model');
const config = require('../../common/config/env.config');

exports.ConvertStringToBarcode = (req, res) => {
    var CloudmersiveBarcodeapiClient = require('cloudmersive-barcodeapi-client');
    var defaultClient = CloudmersiveBarcodeapiClient.ApiClient.instance;

    // Configure API key authorization: Apikey
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = config.cloudmersiveApiKey;



    var apiInstance = new CloudmersiveBarcodeapiClient.GenerateBarcodeApi();

    var value = "123456789"; // String | QR code text to convert into the QR code barcode


    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ' + data);
            BarcodeModel.createBarcode(data).then((result) => {
                res.status(200).send(result);
            })
        }
    };
    apiInstance.generateBarcodeQRCode(value, callback);
};

exports.list = (req, res) => {
    BarcodeModel.list(req.jwt.userId)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    BarcodeModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};