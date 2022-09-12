import { NextFunction, Response } from "express";
import fs from "fs/promises";
import { CustomRequest } from "./CustomRequest";
import createCustomError from "../../utils/createCustomError";
import imageStorage from "./imageStorage";

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest
          .fn()
          .mockResolvedValue(createCustomError(404, "Something went wrong")),
        getPublicUrl: () => ({
          publicURL: "Public Url",
        }),
      }),
    },
  }),
}));

const bodyRequest = {
  name: "",
  description: "",
  image: "",
  artist: "",
  artistName: "",
  resolution: "",
};

const fileRequest = {
  filename: "drawing",
  originalname: "drawing.jpg",
} as Partial<Express.Multer.File>;

const req = {
  body: bodyRequest,
  file: fileRequest,
} as Partial<CustomRequest>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile("uploads/drawing", "drawing");
});

afterAll(async () => {
  await fs.unlink("uploads/1000-drawing.jpg");
  jest.clearAllMocks();
});

describe("Given the imageStorage middleware", () => {
  describe("When it's called with correct request with image game", () => {
    describe("And image is uploaded to supabase", () => {
      test("Then next then should be called", async () => {
        jest.spyOn(Date, "now").mockReturnValueOnce(1000);

        await imageStorage(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});
