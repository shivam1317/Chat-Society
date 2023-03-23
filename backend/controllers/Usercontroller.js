const prisma = require("../prisma/index");
exports.addUser = async (req, res, next) => {
  try {
    const { Email, Name, api_secret } = req.body;
    if (api_secret !== process.env.API_SECRET) {
      res.status(401);
      res.json({ msg: "UnAuthorized!" });
    } else {
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
    }
  } catch (error) {
    res.json(error.messsage);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { Name, id, api_secret } = req.body;
    if (api_secret !== process.env.API_SECRET) {
      res.status(401);
      res.send("Unauthorized!");
    } else {
      const result = await prisma.user.update({
        where: {
          id,
        },
        data: {
          Name,
        },
      });
      res.json(result);
    }
  } catch (error) {
    res.json(error.message);
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
