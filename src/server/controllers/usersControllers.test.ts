import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import registerUser from "./usersControllers";

describe("Given a createUser Function", () => {
  describe("When called", () => {
    test("It should invoke the reponse 'status' method with 201", async () => {
      const mockUser = {
        userName: "artist",
        password: "123",
      } as Partial<Request>;

      const req = { body: mockUser } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;
      User.create = jest.fn().mockReturnValue(mockUser);
      await registerUser(req as Request, res as Response, next as NextFunction);
      const status = 201;
      expect(res.status).toBeCalledWith(status);
    });

    test("It should invoke the reponse 'json' method with the mockUser", async () => {
      const mockUser = {
        userName: "artist",
        password: "123",
      };

      User.create = jest.fn().mockReturnValue(mockUser);

      const req = { body: mockUser } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;
      User.create = jest.fn();
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toBeCalled();
    });
  });
});
