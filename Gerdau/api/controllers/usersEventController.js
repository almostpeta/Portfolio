import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const UsersEvents = models.usersEvents;
const User = models.user;
export default class userEventService {
  // find all the reporting users of an event
  async getAllUsersEvent(data) {
    return await UsersEvent.findAll({ where: { eventId: data } });
  }

  // create reporting users
  async createUserEvent(data) {
    console.log("---", data);
    const result = user.createEvents(data);
    return result;
  }
}
