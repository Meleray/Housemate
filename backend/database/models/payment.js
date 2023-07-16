const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const PaymentSchema = new mongoose.Schema({
    payerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    billId: {
        type: Schema.Types.ObjectId,
        ref: "Bill",
        required: true,
        index: true,
    },
    paymentSum: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: "Negative payment sum"
        }
    },
    senderConfirmation: {
        type: Boolean,
        default: false,
        required: true
    },
    recepientConfirmation: {
        type: Boolean,
        default: false,
        required: true
    }
});

PaymentSchema.set('versionKey', false);


const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
