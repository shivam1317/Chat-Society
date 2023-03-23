const prisma = require("../prisma/index");
exports.sendMsg = async (messageData) => {
  try {
    console.log(
      `author : ${messageData.author} | message : ${messageData.message} | channelId: ${messageData.channelId} | authorId: ${messageData.authorId}`
    );
    const result = await prisma.message.create({
      data: {
        message: messageData.message,
        author: messageData.author,
        authorId: messageData.authorId,
        channelName: { connect: { id: messageData.channelId } },
        type: messageData.type,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getMessages = async (req, res, next) => {
  const { take } = req.query;
  try {
    const { channelId } = req.params;
    let msgs;
    msgs = await prisma.message.findMany({
      where: {
        channelId,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    let flag = parseInt(take) && !Number.isNaN(parseInt(take));
    const data = {
      msgs: flag ? msgs.slice(-1) : msgs,
    };
    if (msgs.length >= 5) {
      data["next"] = parseInt(take) + 5;
    }
    res.json(data);
  } catch (error) {
    res.json(error.message);
  }
};
