const BarcodeModel = require('../models/barcode.model');
const config = require('../../common/config/env.config');
const fs = require('fs')

exports.ConvertStringToBarcode = (req, res) => {
    var CloudmersiveBarcodeapiClient = require('cloudmersive-barcodeapi-client');
    var defaultClient = CloudmersiveBarcodeapiClient.ApiClient.instance;

    // Configure API key authorization: Apikey
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = config.cloudmersiveApiKey;



    var apiInstance = new CloudmersiveBarcodeapiClient.GenerateBarcodeApi();

    var value = req.body.mensagem; // String | QR code text to convert into the QR code barcode

    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            function makeid(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            let filename = "barcodes/" + makeid(10) + ".png";
            fs.writeFile(filename, data, 'base64', function (err) {
                console.log(err);
            });
            let barcodeData = {
                image: filename,
                user: req.jwt.userId,
                text: req.body.mensagem
            }
            BarcodeModel.createBarcode(barcodeData).then((result) => {
                res.status(200).send(result);
            })
        }
    };
    if (req.body.tipo == 'QR') {
        apiInstance.generateBarcodeQRCode(value, callback);
    } else {
        apiInstance.generateBarcodeUPCE(value, callback);
    }
};

exports.ConvertBarcodeToString = (req, res) => {
    var CloudmersiveBarcodeapiClient = require('cloudmersive-barcodeapi-client');
    var defaultClient = CloudmersiveBarcodeapiClient.ApiClient.instance;
    
    // Configure API key authorization: Apikey
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = config.cloudmersiveApiKey;



    var apiInstance = new CloudmersiveBarcodeapiClient.BarcodeLookupApi();

    var imageFile = Buffer.from(fs.readFileSync("/Users/gabrielsousa/Source/Repos/Projeto2/" + req.file.path).buffer);


    var opts = {
        'language': req.body.language,
        'preprocessing': "Auto"
    };

    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            OcrData = {
                image: req.file.path,
                text: data.TextResult,
                user: req.jwt.userId,
            }
            OcrModel.createOcr(OcrData).then((result) => {
                res.status(200).send(result);
            });;
            console.log('API called successfully. Returned data: ' + data);
        }
    };
    apiInstance.imageOcrPost(imageFile, opts, callback);
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