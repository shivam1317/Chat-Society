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
    console.log("Backend got name as ", Name);
    const result = await prisma.server.create({
      data: {
        Name,
      },
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.json({
      msg: "You just created a server!",
      result,
    });
  } catch (error) {
    res.json(error.message);
  }
};
