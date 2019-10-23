const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const barcodeSchema = new Schema({
    image: String,
    text: String,
    user: String,
      
});

barcodeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
barcodeSchema.set('toJSON', {
    virtuals: true
});

barcodeSchema.findById = function (cb) {
    return this.model('Barcodes').find({id: this.id}, cb);
};

const Barcode = mongoose.model('Barcodes', barcodeSchema);

exports.findById = (id) => {
    return Barcode.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createBarcode = (barcodeData) => {
    const barcode = new Barcode(barcodeData);
    return barcode.save().then(() => {
        result = barcodeData;
        return result;
    });
};

exports.list = (userId) => {
    return new Promise((resolve, reject) => {
        Barcode.find({user: userId})
            .exec(function (err, barcodes) {
                if (err) {
                    reject(err);
                } else {
                    // i=0;
                    // var barcodes = JSON.stringify(barcodes);
                    let list = [];
                    // barcodes.forEach(function(v){ v.id = undefined });
                    barcodes.forEach(function(barcode){
                        objectToAdd = {
                            image: barcode.image,
                            id: barcode.id,
                            text: barcode.text
                        }
                        list.push(objectToAdd);
                    })
                    resolve(list);
                }
            })
    });
};

