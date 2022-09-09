import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import { IUser } from "../../interfaces/interfaces";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "../middlewares/CustomRequest";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
} from "./usersControllers";

let mockHashCompare = true;

jest.mock("../../utils/auth", () => ({
  ...jest.requireActual("../../utils/auth"),
  hashCreate: () => jest.fn().mockReturnValue("#"),
  hashCompare: () => mockHashCompare,
  createToken: () => jest.fn().mockReturnValue("#"),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a createUser Function", () => {
  describe("When called", () => {
    test("It should invoke the reponse 'status' method with 201", async () => {
      const mockUser = {
        userName: "artist",
        password: "12345",
        email: "fake@fake.com",
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
        password: "12345",
        email: "fake@fake.com",
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

    test("If something went wrong in express validation, it should send a customError to the errors middleware", async () => {
      const mockUser = {
        userName: "artist",
        password: "123",
        email: "fake@fake.com",
      };
      User.create = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(
        404,
        `"password" length must be at least 5 characters long`
      );
      const req = { body: mockUser } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If something went wrong after express validation, it should send a customError to the errors middleware", async () => {
      const mockUser = {
        userName: "artist",
        password: "12345",
        email: "fake@fake.com",
      };
      User.create = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, "");
      const req = { body: mockUser } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockUser = {
      _id: "123",
      userName: "name",
      password: "password",
    };

    const mockLoginData = {
      userName: "name",
      password: "password",
    };
    const req = {
      body: mockLoginData,
    } as Partial<Request>;

    User.find = jest.fn().mockReturnValue([mockUser]);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn() as NextFunction;
    test("It should call status with a code of 200", async () => {
      const status = 200;

      await loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("It should respond with a new user as a body", async () => {
      User.find = jest.fn().mockReturnValue([mockUser]);

      await loginUser(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalled();
    });

    test("If find method retuns an error, it should send it to the errors middleware", async () => {
      User.find = jest.fn().mockRejectedValue(new Error("test"));

      await loginUser(req as Request, res as Response, next);
      const error = createCustomError(404, "test");

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If find method finds no users it should return an empty array, and an error should be sent to the errors middleware", async () => {
      User.find = jest.fn().mockReturnValue([]);

      await loginUser(req as Request, res as Response, next);
      const error = createCustomError(404, "ERROR! User not found");

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If password is not valid, it should send an error to the errors middleware", async () => {
      User.find = jest.fn().mockReturnValue([mockUser]);

      mockHashCompare = false;

      await loginUser(req as Request, res as Response, next);

      const error = createCustomError(404, "Incorrect user name or password");

      expect(next).toHaveBeenCalledWith(error);
    });

    test("If something went wrong in express validation, it should send a customError to the errors middleware", async () => {
      const mockBadLoginData = {
        userName: "name",
        password: "",
      };

      User.find = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(
        404,
        `"password" is not allowed to be empty`
      );
      const badRequest = { body: mockBadLoginData } as Partial<Request>;

      await loginUser(
        badRequest as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getAllUsers function", () => {
  describe("When called with a response and a request as arguments", () => {
    test("It should invoke the response 'status' method with 200", async () => {
      const req = {} as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;

      User.find = jest.fn();

      await getAllUsers(req as Request, res as Response, next as NextFunction);
      const status = 200;
      expect(res.status).toBeCalledWith(status);
    });

    test("And it should invoke the response 'json' method with a list of users", async () => {
      const userList: IUser = { _id: "1", userName: "", password: "" };
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;

      User.find = jest.fn().mockResolvedValue(userList);
      await getAllUsers(req as Request, res as Response, next as NextFunction);
      expect(res.json).toBeCalled();
    });

    test("And if something went wrong, it should send a custom error to the errors middleware", async () => {
      const req = {} as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;

      User.find = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, `Unable to fetch users`);

      await getAllUsers(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getUserById controller function", () => {
  describe("When called", () => {
    test("It should return the status 200", async () => {
      const req = {
        params: "631af69fd7b1680010f8caf4" as unknown,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const mockUser = {
        _id: "631af69fd7b1680010f8caf4",
        userName: "testing2",
        password:
          "$2a$10$M/SPzuKyL0SlMy1AD2Qu2eXuztYfEX/f0fO.ZDojCzwqujSN0wz26",
        email: "fakemail@mail.com",
        drawings: [
          {
            _id: "12345",
            name: "aaaa",
            description: "aaaaa",
            image: "asdasdasdasd",
            resolution: "60x90",
            artist: "631af69fd7b1680010f8caf4",
            __v: "0",
          },
        ],
        __v: "1",
      };

      User.findById = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockReturnValue(mockUser);

      await getUserById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("And if something went wrong it should send a customError to the error's middleware", async () => {
      const req = {
        params: "631af69fd7b1680010f8caf4" as unknown,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const customError = createCustomError(404, "Unable to fetch drawings");

      User.findById = jest.fn().mockReturnThis();
      User.populate = jest.fn().mockRejectedValue(new Error(""));

      await getUserById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a deleteUser controller function", () => {
  describe("When invoked", () => {
    test("It should take the id received as params and delete the user with that id from the DB", async () => {
      const req = {
        params: "631210bb4b6e6a4c59950938" as unknown,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      User.findById = jest.fn().mockReturnThis();
      User.deleteOne = jest.fn().mockReturnThis();

      await deleteUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("It should take the id received as params and delete the user with that id from the DB", async () => {
      const req = {
        params: "631210bb4b6e6a4c59950938" as unknown,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      const error = createCustomError(404, `Something went wrong`);
      User.findById = jest.fn().mockRejectedValue(new Error(""));

      await deleteUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
