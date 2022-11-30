const prisma = require("../prisma/index");
exports.sendMsg = async (messageData) => {
  try {
    console.log(
      `author : ${messageData.author} | message : ${messageData.message} | channelId: ${messageData.channelId}`
    );
    // const { message, channelId, author } = req.body;
    const result = await prisma.message.create({
      data: {
        message: messageData.message,
        author: messageData.author,
        channelName: { connect: { id: messageData.channelId } },
      },
    });
    console.log(result);
    // res.json({
    //   msg: "Your msg is successfully sent!",
    //   result,
    // });
  } catch (error) {
    // res.json(error.message);
    console.log(error);
  }
};

exports.getMessages = async (req, res, next) => {
  const { take } = req.query;
  try {
    const { channelId } = req.params;
    let msgs;
    if (parseInt(take) && !Number.isNaN(parseInt(take))) {
      msgs = await prisma.message.findMany({
        where: {
          channelId,
        },
        take: parseInt(take || "5"),
        skip: parseInt(take) > 5 ? parseInt(take) - 5 : undefined,
        orderBy: {
          timestamp: "asc",
        },
      });
      console.log("if wala block chaala vai");
    } else {
      msgs = await prisma.message.findMany({
        where: {
          channelId,
        },
        orderBy: {
          timestamp: "asc",
        },
      });
      console.log("else wala block chaala vai");
    }
    const data = {
      msgs,
    };
    if (msgs.length >= 5) {
      data["next"] = parseInt(take) + 5;
    }
    res.json(data);
  } catch (error) {
    res.json(error.message);
  }
};
