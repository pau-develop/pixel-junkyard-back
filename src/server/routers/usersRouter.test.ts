import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import connectToDB from "../../database/connectToDB";
import User from "../../database/models/User";
import app from "../index";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const url = mongoServer.getUri();
  await connectToDB(url);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a usersRouter", () => {
  describe("When it receives a request on /all path", () => {
    test("It should call the getAllUsers controller function and return an array of users and the status 200", async () => {
      const { body } = await request(app).get("/users/all").expect(200);

      expect(body).toHaveProperty("users", []);
    });
  });
});
