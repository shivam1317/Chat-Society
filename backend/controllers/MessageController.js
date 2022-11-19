const prisma = require("../prisma/index");
exports.sendMsg = async (messageData) => {
  try {
    console.log(
      `author : ${messageData.author} | message : ${messageData.message} | channelId: ${messageData.channelId} | time: ${messageData.timestamp}`
    );
    // const { message, channelId, author } = req.body;
    const result = await prisma.message.create({
      data: {
        message: messageData.message,
        author: messageData.author,
        channelName: { connect: { id: messageData.channelId } },
        timestamp: messageData.timestamp,
      },
    });
    console.log(result);
    // res.json({
    //   msg: "Your msg is successfully sent!",
    //   result,
    // });
  } catch (error) {
    // res.json(error.message);
    console.log(error)
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const msgs = await prisma.message.findMany({
      where: {
        channelId,
      },
    });
    res.json(msgs);
  } catch (error) {
    res.json(error.message);
  }
};
