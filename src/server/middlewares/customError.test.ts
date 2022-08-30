import { Request, Response, NextFunction } from "express";
import createCustomError from "../../utils/createCustomError";
import customError from "./customError";

describe("Given a customError function", () => {
  describe("When called with a CustomError as arguments", () => {
    const error = createCustomError(404, "els problems", "els public problems");
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next = jest.fn();

    customError(error, req as Request, res as Response, next as NextFunction);
    test("It should call the status method with the value received from the CustomError property 'statucCode'", () => {
      const status = 404;

      expect(res.status).toBeCalledWith(status);
    });

    test("It should call the json method with the value received from the customError property 'errorMessage'", () => {
      const testError = { error: error.errorMessage };

      expect(res.json).toBeCalledWith(testError);
    });
  });
});
