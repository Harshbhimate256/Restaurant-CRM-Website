import bookingModel from "../models/bookingModel.js";

export const isPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingModel.findById(id);
    if (!booking) {
      return res.status(400).json({ message: "booking not found" });
    }
    if (!booking.payment) {
      return res.status(400).json({ msg: "Payment is required !" });
    }
    next();
  } catch (error) {
    console.log("error while checking the payment", error);
    res.status(401).json({error:"internal server error"})
  }
};
