const paymentService=require("../services/payment.service.js")
const PaymentInformation = require("../models/payment.information.js");

const createPaymentLink=async(req,res)=>{

    try {
        const paymentLink=await paymentService.createPaymentLink(req.params.id);
        return res.status(200).send(paymentLink)
    } catch (error) {
        return res.status(500).send(error.message);
    }

}

const updatePaymentInformation=async(req,res)=>{

    try {
        await paymentService.updatePaymentInformation(req.query)
        return res.status(200).send({message:"payment information updated",status:true})
    } catch (error) {
        return res.status(500).send(error.message);
    }

}
const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.query.orderId || null;

    const history = await paymentService.getUserPaymentHistory(userId, orderId); // 👈 correct
    return res.status(200).json(history);
  } catch (error) {
    console.error("Payment history controller error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports={createPaymentLink,updatePaymentInformation, getUserPaymentHistory,}