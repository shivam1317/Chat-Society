const prisma = require("../prisma/index");
const { uid } = require("uid");

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
    const { Name, ownerId, api_secret } = req.body;
    if (api_secret !== process.env.API_SECRET) {
      res.status(401);
      res.send("Unauthorized!");
    } else {
      const result = await prisma.server.create({
        data: {
          Name,
          Owner: { connect: { id: ownerId } },
          Code: uid(8),
        },
      });
      let d = {
        Name,
        id: result.id,
        Code: result.Code,
        ownerId,
      };
      const ok = await prisma.user.update({
        where: {
          id: ownerId,
        },
        data: {
          joinedServers: {
            push: d,
          },
        },
      });
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.json(result);
    }
  } catch (error) {
    res.json(error.message);
  }
};

exports.joinServer = async (req, res, next) => {
  try {
    // Find the server by id
    const { userId, Code, api_secret } = req.body;
    if (api_secret !== process.env.API_SECRET) {
      res.status(401);
      res.send("Unauthorized!");
    } else {
      const servers = await prisma.server.findMany({
        where: {
          Code,
        },
      });
      // Add this server in user's list if it exists
      if (servers.length > 0) {
        let d = {
          Name: servers[0].Name,
          id: servers[0].id,
          ownerId: servers[0].ownerId,
          Code,
        };
        try {
          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              joinedServers: {
                push: d,
              },
            },
          });
          res.json({ msg: "You successfully joined the home!" });
        } catch (error) {
          res.json(error.message);
        }
      } else {
        res.json({ msg: "Home Doesn't exist!" });
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};
