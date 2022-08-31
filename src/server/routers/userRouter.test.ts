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

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a usersRouter", () => {
  describe("When it receives a request on /register path with a 'RegisterData' object", () => {
    test("It should call the registerUser controller function", async () => {
      const user = {
        userName: "pepito",
        password: "1235678",
        email: "fake@fakes.com",
      };
      const message = "User registered!";
      const { body } = await request(app)
        .post("/users/register")
        .send(user)
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });
});
