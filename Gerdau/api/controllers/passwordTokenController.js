import sequelize from "../db/dbconection.js";
const { v4: uuidv4 } = require("uuid");
import {
  sendForgotPasswordEmail,
  sendRegisterEmail,
} from "../utils/sendMail.js";

const Token = sequelize.models.token;
const User = sequelize.models.user;

export default class PasswordTokenController {
  async createForgetPasswordToken(email) {
    if (!email) {
      throw { status: 301, message: "Bad Request" };
    }
    const user = await User.findOne({ where: { email, isActive: 1 } });
    if (!user) {
      throw { status: 301, message: "Bad Request" };
    }

    await this._tryDeleteExistingTokens(user.id); // remove existing and active tokens

    const randomToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const newToken = {
      isActive: 1,
      token: randomToken,
      userId: user.id,
      expiresAt,
    };

    await Token.create(newToken);

    sendForgotPasswordEmail({
      email: user.email,
      userName: user.name,
      url: process.env.FORGOT_PASSWORD_URL.replace("${token}", randomToken),
    });
  }

  async createRegisterToken(user) {
    const randomToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const newToken = {
      userId: user.id,
      token: randomToken,
      isActive: 1,
      expiresAt,
    };

    await Token.create(newToken);

    sendRegisterEmail({
      email: user.email,
      userName: user.name,
      url: process.env.REGISTER_URL.replace("${token}", randomToken),
    });
  }

  async _tryDeleteExistingTokens(userId) {
    try {
      return await Token.destroy({ where: { userId, isActive: 1 } });
    } catch (ex) {
      return null;
    }
  }
}
