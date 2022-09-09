import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import connectToDB from "../../database/connectToDB";
import Drawing from "../../database/models/Drawing";
import app from "../index";

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzE4N2FmOGJkYjVmMGI2YmFjNGI4YTAiLCJ1c2VyTmFtZSI6InRlc3RpbmciLCJpYXQiOjE2NjI3MTE2MjR9.7994Wtuc4xBTE_m9UeNt7ZLl7tOO22TnnoU2tJoo874`;

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const url = mongoServer.getUri();
  await connectToDB(url);
});

afterEach(async () => {
  await Drawing.deleteMany({});
});

afterAll(async () => {
  await Drawing.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a usersRouter", () => {
  describe("When it receives a request on users/all path", () => {
    test("It should call the getAllUsers controller function and return an array of users and the status 200", async () => {
      const { body } = await request(app)
        .get("/drawings/all")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveProperty("drawings", []);
    });
  });

  describe("When it receives a request on drawings/:id path", () => {
    test("It should call the getDrawingById controller function and return a drawing object and the status 200", async () => {
      const id = "63164113ba871815e6cd02b0";
      const { body } = await request(app)
        .get(`/drawings/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toHaveProperty("drawing");
    });
  });
});
