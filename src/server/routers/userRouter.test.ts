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
  describe("When it receives a request on /register path with a 'RegisterData' object", () => {
    test("It should call the registerUser controller function and return a message", async () => {
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

  describe("When it receives a request on /login path with a 'LoginData' object", () => {
    test("It should call the loginUser controller function and respond with status 200", async () => {
      const userRegister = {
        userName: "pepito",
        password: "123456",
        email: "fake@fake.com",
      };
      const userLogin = {
        userName: "pepito",
        password: "123456",
      };

      await request(app).post("/users/register").send(userRegister).expect(201);
      await request(app).post("/users/login").send(userLogin).expect(200);
    });
  });
});
