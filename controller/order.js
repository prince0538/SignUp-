const orderModel = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const { orderName, orderAmount, orderDescription, orderStatus } = req.body;
    const newOrder = await orderModel.create({
      orderName,
      orderBy: req.signUp.id,
      orderAmount,
      orderDescription,
      orderStatus,
      orderDate: new Date(),
    });
    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const order = await orderModel.find();
    res.status(200).json({
      message: "All orders retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
