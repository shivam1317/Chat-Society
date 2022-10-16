const prisma = require("../prisma/index");

exports.getChannelList = async (req, res, next) => {
  try {
    const channels = await prisma.channel.findMany();
    res.json(channels);
  } catch (error) {
    res.json(error.message);
  }
};

exports.createChannel = async (req, res, next) => {
  try {
    const { serverId, channelName } = req.body;
    const result = await prisma.channel.create({
      data: {
        channelName,
        serverName: { connect: { id: serverId } },
      },
    });
    res.json({
      msg: "You just created a server!",
      result,
    });
  } catch (error) {
    // throw new Error(error.message);
    res.json(error.message);
  }
};
