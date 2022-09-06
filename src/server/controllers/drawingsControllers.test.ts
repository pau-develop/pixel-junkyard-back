import { Request, Response, NextFunction } from "express";
import Drawing from "../../database/models/Drawing";
import createCustomError from "../../utils/createCustomError";
import getAllDrawings, { getDrawingById } from "./drawingsControllers";

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
      const userList: any = {};
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
