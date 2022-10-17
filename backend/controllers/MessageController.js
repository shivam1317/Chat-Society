const prisma = require("../prisma/index");

exports.sendMsg = async (req, res, next) => {
  try {
    const { message, channelId, author } = req.body;
    const date = new Date();
    const result = await prisma.message.create({
      data: {
        message,
        author,
        channelName: { connect: { id: channelId } },
        timestamp: date.toLocaleString(),
      },
    });
    res.json({
      msg: "Your msg is successfully sent!",
      result,
    });
  } catch (error) {
    res.json(error.message);
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
