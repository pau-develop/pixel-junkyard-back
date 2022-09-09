import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import User from "../../database/models/User";
import { IUser } from "../../interfaces/interfaces";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "../middlewares/CustomRequest";
import getAllDrawings, {
  createDrawing,
  getDrawingById,
} from "./drawingsControllers";

describe("Given a getAllDrawings function", () => {
  describe("When called with a response and a request as arguments", () => {
    test("It should invoke the response 'status' method with 200", async () => {
      const req = {} as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;

      Drawing.find = jest.fn();

      await getAllDrawings(
        req as Request,
        res as Response,
        next as NextFunction
      );
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

      Drawing.find = jest.fn().mockResolvedValue(userList);
      await getAllDrawings(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(res.json).toBeCalled();
    });

    test("And if something went wrong, it should send a custom error to the errors middleware", async () => {
      const req = {} as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;

      Drawing.find = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, `Unable to fetch drawings`);

      await getAllDrawings(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getDrawingById function", () => {
  describe("When called with a response and a request as arguments", () => {
    test("It should invoke the response 'status' method with 200", async () => {
      const req = {
        params: "" as unknown,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;
      Drawing.findById = jest.fn().mockReturnValue({
        _id: "1",
        name: "",
        image: "",
        artist: "",
        resolution: "",
      });

      await getDrawingById(
        req as Request,
        res as Response,
        next as NextFunction
      );
      const status = 200;

      expect(res.status).toBeCalledWith(status);
    });

    test("And if something went wrong, it should send a custom error to the errors middleware", async () => {
      const req = {
        params: "1234" as unknown,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;

      Drawing.findById = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, `Unable to fetch drawing`);

      await getDrawingById(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createDrawing Function", () => {
  describe("When called", () => {
    test("It should invoke the reponse 'status' method with 201", async () => {
      const argumentDrawing = {
        name: "testDrawing",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const createdDrawing = {
        _id: "12345",
        name: "testDrawing",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const user = {
        _id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],
        __v: "0",
        save: jest.fn(),
      };

      const req = { body: argumentDrawing, payload: user } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as Partial<NextFunction>;
      Drawing.create = jest.fn().mockReturnValue(createdDrawing);
      User.findById = jest.fn().mockReturnValue(user);
      await createDrawing(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toBeCalledWith(201);
    });

    test("It should invoke the reponse 'json' method with the createdUser", async () => {
      // const user = {
      //   _id: "1",
      //   userName: "",
      //   password: "",
      //   email: "",
      //   drawings: [""],
      //   __v: "",
      //   save: jest.fn(),
      // };
      // const createdDrawing = {
      //   name: "testDrawing",
      //   description: "none",
      //   image: "asdasdasd",
      //   artist: "testArtist",
      //   resolution: "32x32",
      // } as Partial<Request>;
      // Drawing.create = jest.fn().mockReturnValue(createdDrawing);
      // const req = { body: createdDrawing, payload: user } as Partial<Request>;
      // const res = {
      //   status: jest.fn().mockReturnThis(),
      //   json: jest.fn(),
      // } as Partial<Response>;
      // const next = jest.fn() as Partial<NextFunction>;
      // Drawing.create = jest.fn();
      // User.findById = jest.fn().mockReturnValue(user);
      // await createDrawing(
      //   req as CustomRequest,
      //   res as Response,
      //   next as NextFunction
      // );
      // expect(next).toBeCalledWith("");
    });

    test("If something went wrong in express validation, it should send a customError to the errors middleware", async () => {
      const createdDrawing = {
        name: "a",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const user = {
        _id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],
        __v: "0",
        save: jest.fn(),
      };

      Drawing.create = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(
        404,
        `"name" length must be at least 3 characters long`
      );
      const req = { body: createdDrawing, payload: user } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      await createDrawing(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );
      expect(next).toHaveBeenCalledWith(error);
    });

    test("If something went wrong after express validation, it should send a customError to the errors middleware", async () => {
      const createdDrawing = {
        name: "aaa",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const user = {
        _id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],
        __v: "0",
        save: jest.fn(),
      };

      Drawing.create = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, "Something went wrong");
      const req = { body: createdDrawing, payload: user } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      await createDrawing(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
