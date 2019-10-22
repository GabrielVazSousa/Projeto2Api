const OcrModel = require('../models/ocr.model');
const config = require('../../common/config/env.config');
const fs = require('fs');

exports.ConvertImageToText = (req, res) => {
    var CloudmersiveOcrApiClient = require('cloudmersive-ocr-api-client');
    var defaultClient = CloudmersiveOcrApiClient.ApiClient.instance;

    // Configure API key authorization: Apikey
    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = config.cloudmersiveApiKey;



    var apiInstance = new CloudmersiveOcrApiClient.ImageOcrApi();

    var imageFile =  Buffer.from(fs.readFileSync("/Users/gabrielsousa/Source/Repos/rest-api-tutorial/"+req.file.path).buffer);
   

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
    OcrModel.list(req.jwt.userId)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    OcrModel.findById(req.params.userId)
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