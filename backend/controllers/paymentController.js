const billModel = require("../database/models/bill");
const paymentModel = require("../database/models/payment");
const { assertKeysValid} = require("./utilsForControllers");
const { assertUserBelongs2Space } = require("./assert");
const SpaceController = require("./spaceController");

class PaymentController {

    addBill = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId', 'isEqualSplit', 'billName'], ['totalSum', 'payments', 'billDescription']);
        await assertUserBelongs2Space({spaceId: requestBody.spaceId, userId: requestBody.userId});

        const bill = await billModel.create({
            name: requestBody.billName,
            body: requestBody.billDescription,
            spaceId: requestBody.spaceId,
            reporterId: requestBody.userId,
            totalSum: requestBody.totalSum
        });
        console.log(bill);

        if (requestBody.isEqualSplit) {
            const members = await SpaceController.getSpaceMembers({userId: requestBody.userId, spaceId: requestBody.spaceId});
            const paymentSum = requestBody.totalSum / (members.length - 1)
            for (const member of members) {
                if (member._id != requestBody.userId) {
                    const payment = await paymentModel.create({
                        payerId: member._id,
                        billId: bill._id,
                        paymentSum: paymentSum
                    })
                    console.log(payment);
                } 
            }
        } else {
            for (const payment of requestBody.payments) {
                assertKeysValid(payment, ['id', 'amount'], ['name']);
                await assertUserBelongs2Space({spaceId: requestBody.spaceId, userId: payment.id});
                const createdPayment = await paymentModel.create({
                    payerId: payment.id,
                    billId: bill._id,
                    paymentSum: payment.amount
                });
                console.log(createdPayment);
            }
        }
        return {
            message: "Successfuly added new bill",
        }
    }
    
    confirmTransaction = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'paymentId'], []);
        
        const payment = await Payment.findOne({ _id: requestBody.paymentId  });

        if (!payment) {
            return {
                error: {type: "FAILED_TO_RETRIEVE_TRANSACTION", message: `Transaction with id=${requestBody.paymentId} does not exist`}
            };
        }

        if (payment.payerId == requestBody.userId) {
            payment.senderConfirmation = true;
        } else {
            payment.recepientConfirmation = true;
        }

        if (payment.recepientConfirmation && payment.senderConfirmation) {
            await payment.remove();
            console.log(`[INFO] REMOVED PAYMENT: ${payment}`);
        } else {
            await payment.save();
            console.log(`[INFO] UPDATED PAYMENT: ${payment}`);
        }
    }

    getTransactions = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId', 'otherUserId'], []);
        await assertUserBelongs2Space({spaceId: requestBody.spaceId, userId: requestBody.userId});
        await assertUserBelongs2Space({spaceId: requestBody.spaceId, userId: requestBody.otherUserId});
        const outboundTransactions = await paymentModel.find({
            payerId: requestBody.userId,
        }).populate({
            path: 'billId',
            match: { spaceId: requestBody.spaceId, reporterId: requestBody.otherUserId}
        }).exec();

        const inboundTransactions = await paymentModel.find({
            payerId: requestBody.otherUserId,
        }).populate({
            path: 'billId',
            match: { spaceId: requestBody.spaceId, reporterId: requestBody.userId}
        }).exec();
        return {
            inbound: inboundTransactions.filter((payment) => payment.billId !== null),
            outbound: outboundTransactions.filter((payment) => payment.billId !== null)
        }
    }

    getBillingMainPageInfo = async (requestBody) => {
        assertKeysValid(requestBody, ['userId', 'spaceId'], []);

        await assertUserBelongs2Space({spaceId: requestBody.spaceId, userId: requestBody.userId});

        let outboundSum = 0;
        let inboundSum = 0;
        let inboundOutstandingSum = 0;
        let outboundOutstandingSum = 0;
        let memberBalance = [];
        const members = await SpaceController.getSpaceMembers({spaceId: requestBody.spaceId, userId: requestBody.userId});

        for (const member of members.filter(m => m._id != requestBody.userId)) {

            const transactions = await this.getTransactions({
                userId: requestBody.userId, 
                spaceId: requestBody.spaceId, 
                otherUserId: member._id
            });

            let inboundMemberSum = 0;
            transactions.inbound.map(tr => {
                inboundMemberSum += tr.paymentSum;
            });

            let outboundMemberSum = 0;
            transactions.outbound.map(tr => {
                outboundMemberSum += tr.paymentSum;
            });

            let inboundMemberOutstandingSum = 0;
            transactions.inbound.filter(tr => {
                tr.senderConfirmation
            }).map(tr => {
                inboundMemberOutstandingSum += tr.paymentSum;
            });

            let outboundMemberOutstandingSum = 0;
            transactions.outbound.filter(tr => {
                tr.senderConfirmation
            }).map(tr => {
                outboundMemberOutstandingSum += tr.paymentSum;
            });

            memberBalance.push({
                id: member._id,
                name: member.userName,
                picture: member.userPicture,
                inbound: inboundMemberSum,
                outbound: outboundMemberSum,
                inboundOutstanding: inboundMemberOutstandingSum,
                outboundOutstanding: outboundMemberOutstandingSum
            });
            
            outboundSum += outboundMemberSum;
            inboundSum += inboundMemberSum;
            inboundOutstandingSum += inboundMemberOutstandingSum;
            outboundOutstandingSum += outboundMemberOutstandingSum;

        }

        return {
            outboundSum,
            inboundSum,
            inboundOutstandingSum,
            outboundOutstandingSum,
            memberBalance,
        }
    }

}

module.exports = new PaymentController();