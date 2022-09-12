import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import connectToDB from "../../database/connectToDB";
import User from "../../database/models/User";
import app from "../index";

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzEzODEyYmJmNzVkMGRkYzkzNjBjY2UiLCJ1c2VyTmFtZSI6InRlc3RpbmdUb2tlbiIsImlhdCI6MTY2MjIyMjY0OX0.dBZVoz75C6Uw-Nakfa0QtMcU-2nQc_Msko3YZc87k6c`;

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
  describe("When it receives a request on users/all path", () => {
    test("It should call the getAllUsers controller function and return an array of users and the status 200", async () => {
      const { body } = await request(app)
        .get("/users/all")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveProperty("users", []);
    });
  });

  describe("When it receives a request on users/:id path", () => {
    test("It should call the getUserById controller function and return a user object and the status 200", async () => {
      const id = "630d15dbc57e9e3a3a3fd076";
      const { body } = await request(app)
        .get(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(body).toHaveProperty("user");
    });
  });

  describe("When it receives a request on users/delete/:id path", () => {
    test("It should call the getUserById controller function and return a user object and the status 200", async () => {
      const message = "Succesfully deleted the user";

      const user = {
        userName: "pepito",
        password: "1235678",
        email: "fake@fakes.com",
        avatar: "???",
      };

      const response = await request(app)
        .post("/user/register")
        .send(user)
        .expect(201);
      const {
        body: {
          createdUser: { id },
        },
      } = response;
      const { body } = await request(app)
        .delete(`/users/delete/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveProperty("message", message);
    });
  });
});
