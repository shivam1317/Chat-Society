const prisma = require("../prisma/index");

exports.getServerList = async (req, res, next) => {
  try {
    const servers = await prisma.server.findMany();
    res.json(servers);
  } catch (error) {
    res.json(error.message);
  }
};

exports.addServer = async (req, res, next) => {
  try {
    const { Name } = req.body;
    const result = await prisma.server.create({
      data: {
        Name,
      },
    });
    res.json({
      msg: "You just created a server!",
      result,
    });
  } catch (error) {
    res.json(error.message);
  }
};
