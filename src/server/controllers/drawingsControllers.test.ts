import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import User from "../../database/models/User";
import createCustomError from "../../utils/createCustomError";
import { CustomRequest } from "../middlewares/CustomRequest";
import getAllDrawings, {
  createDrawing,
  deleteDrawing,
  getDrawingById,
} from "./drawingsControllers";

describe("Given a getAllDrawings function", () => {
  describe("When called with a response and a request as arguments", () => {
    test("It should invoke the response 'status' method with 200", async () => {
      const req = {
        query: {
          limit: "4",
          offset: "0",
        },
      } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      Drawing.countDocuments = jest.fn().mockReturnValue(20);
      Drawing.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(4),
        }),
      });
      await getAllDrawings(
        req as Request,
        res as Response,
        next as NextFunction
      );
      const status = 200;
      expect(res.status).toBeCalledWith(status);
    });

    test("And it should invoke the response 'json' method with a list of users", async () => {
      const req = {
        query: {
          limit: "4",
          offset: "0",
        },
      } as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      Drawing.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(4),
        }),
      });
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
      const mockArtist = {
        id: "63187af8bdb5f0b6bac4b8a0",
        userName: "testing",
        password:
          "$2a$10$nivAu3co14h3X0sQ9liD.e7HDKqBuK/uXQFrl8ZtTMO4riX5Ljn5e",
        email: "fakemail@mailzzz.com",
        drawings: ["631be16485600fd78e91132a"],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      Drawing.findById = jest.fn().mockReturnThis();
      Drawing.populate = jest.fn().mockReturnValue(mockArtist);
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
      Drawing.findById = jest.fn().mockReturnThis();
      Drawing.populate = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, "Somethign went wrong");
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
        id: "12345",
        name: "testDrawing",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const user = {
        id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],

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

    test("If something went wrong in express validation, it should send a customError to the errors middleware", async () => {
      const createdDrawing = {
        name: "a",
        description: "none",
        image: "asdasdasd",
        artist: "testArtist",
        resolution: "32x32",
      } as Partial<Request>;

      const user = {
        id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],

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
        id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],
        save: jest.fn(),
      };
      Drawing.create = jest.fn().mockRejectedValue(new Error(""));
      const error = createCustomError(404, "");
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

describe("Given a delete drawingDrawing controller function", () => {
  describe("When it is invoked", () => {
    test("It should call the response status method with 200", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const user = {
        id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],

        save: jest.fn(),
      };
      const next = jest.fn() as NextFunction;
      const req: Partial<CustomRequest> = {
        params: { drawingId: "1" },
        payload: user,
      };

      const status = 200;
      Drawing.deleteOne = jest.fn();
      User.findOneAndUpdate = jest.fn();

      await deleteDrawing(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("If something went wrong, it should send a customError to the errors middleware", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const user = {
        id: "631b157b469ae9f52c4dd0e7",
        userName: "testUser",
        password: "12345",
        email: "fake@fake",
        drawings: ["1234", "1234"],

        save: jest.fn(),
      };
      const next = jest.fn() as NextFunction;
      const req: Partial<CustomRequest> = {
        params: { id: "1" },
        payload: user,
      };

      Drawing.find = jest.fn().mockReturnValue(["", ""]);
      Drawing.deleteOne = jest.fn();
      User.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(""));

      await deleteDrawing(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const customError = createCustomError(404, "Something went wrong");
      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
