const prisma = require("../prisma/index");

exports.getChannelList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const channels = await prisma.channel.findMany({
      where: {
        serverId: id,
      },
    });
    res.json(channels);
  } catch (error) {
    res.json(error.message);
  }
};

exports.createChannel = async (req, res, next) => {
  try {
    const { serverId, channelName, ownerId } = req.body;
    const result = await prisma.channel.create({
      data: {
        channelName,
        serverName: { connect: { id: serverId } },
        Owner: { connect: { id: ownerId } },
      },
    });
    res.json({
      msg: "You just created a channel!",
      result,
    });
  } catch (error) {
    res.json(error.message);
  }
};
