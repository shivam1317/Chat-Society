const prisma = require("../prisma/index");
exports.addUser = async (req, res, next) => {
  try {
    const { Email, Name } = req.body;
    const uniqueUser = await prisma.user.findMany({
      where: {
        Email,
      },
    });
    if (uniqueUser.length === 0) {
      const result = await prisma.user.create({
        data: {
          Email,
          Name,
          joinedServers: [],
        },
      });
      res.json(result);
    } else {
      res.json(uniqueUser[0]);
    }
  } catch (error) {
    res.json(error.messsage);
  }
};

exports.getJoinedServers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servers = await prisma.user.findMany({
      where: {
        id,
      },
      select: {
        joinedServers: true,
      },
    });
    res.json(servers[0]);
  } catch (error) {
    res.json(error.messsage);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    res.json(user);
  } catch (error) {
    res.json(error.messsage);
  }
};
