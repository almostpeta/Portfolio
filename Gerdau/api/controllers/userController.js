import sequelize from "../db/dbconection.js";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import bcrypt from "bcryptjs";
import PasswordTokenController from "./passwordTokenController.js";

const models = sequelize.models;
const User = models.user;
const Token = models.token;
export default class UserService {
  // find all users
  async getAllUsers() {
    return await User.findAll({
      attributes: [
        "id",
        "name",
        "firstName",
        "lastName",
        "email",
        "role",
        "isActive",
      ],
    });
  }

  // find all users by role
  async getUser(userRole) {
    return await User.findAll({
      where: { role: userRole },
      attributes: [
        "id",
        "name",
        "firstName",
        "lastName",
        "email",
        "role",
        "isActive",
      ],
    });
  }

  // find one user
  async getOneUser(email) {
    return await User.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "firstName",
        "lastName",
        "email",
        "role",
        "isActive",
      ],
    });
  }

  async getOneUserId(id) {
    return await User.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "firstName",
        "lastName",
        "email",
        "role",
        "isActive",
      ],
    });
  }

  async editUser(userData) {
    const { id } = userData;
    await User.update(userData, { where: { id } });
    const user = await User.findOne({ where: { id } });
    return {
      id: user.dataValues.id,
      firstName: user.dataValues.firstName,
      lastName: user.dataValues.lastName,
      name: user.name,
      email: user.dataValues.email,
      role: user.dataValues.role,
      isActive: user.dataValues.isActive,
    };
  }

  async register(user) {
    try {
      if (!user) {
        throw new Error("Bad Request");
      }
      const cleanUser = { ...user, role: user.role.toLowerCase(), isActive: 1 };
      const createdUser = await User.create(cleanUser);
      const passwordTokenController = new PasswordTokenController();
      await passwordTokenController.createRegisterToken(createdUser);
    } catch (err) {
      if (/Violation of UNIQUE KEY constraint/.test(err.parent)) {
        throw new Error("Email already exists");
      }
      throw err;
    }
  }

  async login(res, user, excludePasswordCheck = false) {
    const data = await User.findOne({ where: { email: user.email } });

    if (!data) {
      return res.status(401).send({ auth: false, token: null });
    }
    if (!excludePasswordCheck) {
      const passwordIsValid = bcrypt.compareSync(user.password, data.password);
      if (!passwordIsValid)
        return res.status(401).send({ auth: false, token: null });
    }

    const signedData = {
      id: data.dataValues.id,
      role: data.dataValues.role,
    };

    const token = jwt.sign(signedData, config.secret, {
      expiresIn: 5184000, // expires in 24 hours
    });

    res.status(200).send({
      auth: true,
      token: token,
      expiresIn: 5184000,
      user: data,
    });
  }

  async me(res, token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });

      res.status(200).send(decoded);
    });
  }

  async disableUser({ userId }) {
    if (!userId) {
      throw { status: 400, message: "Not valid data" };
    }

    await User.update({ isActive: 0 }, { where: { id: userId } });
  }

  async enableUser({ userId }) {
    if (!userId) {
      throw { status: 400, message: "Not valid data" };
    }

    await User.update({ isActive: 1 }, { where: { id: userId } });
  }

  async changePassword(res, userData) {
    const token = await Token.findOne({
      where: {
        token: userData.token,
        isActive: 1,
      },
    });

    if (!token) {
      throw { status: 400, message: "Token expired or does not exist" };
    }
    const user = {
      password: bcrypt.hashSync(userData.password, 8),
    };

    await User.update(user, {
      where: { id: token.userId },
    });

    const retrievedUser = await User.findOne({ where: { id: token.userId } });

    token.isActive = 0;

    const tokenToUpdate = {
      id: token.id,
      isActive: 0,
    };

    await Token.update(tokenToUpdate, {
      where: { id: token.id },
    });

    return this.login(res, retrievedUser, true);
  }
}
