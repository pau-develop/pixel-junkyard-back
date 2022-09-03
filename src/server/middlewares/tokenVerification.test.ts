import { NextFunction, Response } from "express";
import createCustomError from "../../utils/createCustomError";

import { CustomRequest } from "./CustomRequest";
import tokenVerification from "./tokenVerification";

describe("Given a tokenVerification middleware", () => {
  describe("When called", () => {
    test("It should send an error when there is no Authentication header or when the Authentication doesn't start with bearer", async () => {
      const mockReturn = jest.fn().mockReturnValue("badRequest");
      const req = { get: mockReturn } as Partial<CustomRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      await tokenVerification(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );
      const customError = createCustomError(404, "Authentication error");

      expect(next).toHaveBeenCalledWith(customError);
    });

    test("It should send an error when there is no Authentication header or when the Authentication doesn't start with bearer", async () => {
      const mockReturn = jest.fn().mockReturnValue("Bearer fakeToken");
      const req = { get: mockReturn } as Partial<CustomRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn() as Partial<NextFunction>;
      await tokenVerification(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );
      const customError = createCustomError(404, "Authentication error");

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
