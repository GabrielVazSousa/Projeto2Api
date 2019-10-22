const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const ocrSchema = new Schema({
    image: String,
    text: String,
    user: String,
      
});

ocrSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ocrSchema.set('toJSON', {
    virtuals: true
});

ocrSchema.findById = function (cb) {
    return this.model('Ocrs').find({id: this.id}, cb);
};

const Ocr = mongoose.model('Ocrs', ocrSchema);

exports.findById = (id) => {
    return Ocr.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createOcr = (ocrData) => {
    const ocr = new Ocr(ocrData);
    return ocr.save().then(()=>{
        result = ocrData;
        return result;
    });
};

exports.list = (userId) => {
    return new Promise((resolve, reject) => {
        Ocr.find({user: userId})
            .exec(function (err, ocrs) {
                if (err) {
                    reject(err);
                } else {
                    // i=0;
                    // var ocrs = JSON.stringify(ocrs);
                    let list = [];
                    // ocrs.forEach(function(v){ v.id = undefined });
                    ocrs.forEach(function(ocr){
                        objectToAdd = {
                            image: ocr.image,
                            id: ocr.id,
                            text: ocr.text
                        }
                        list.push(objectToAdd);
                    })
                    resolve(list);
                }
            })
    });
};

