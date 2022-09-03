import { JwtPayload } from "jsonwebtoken";
import { createToken, hashCompare, hashCreator, verifyToken } from "./auth";

const mockSignature = jest.fn().mockReturnValue("#");
const mockVerification = jest.fn().mockReturnValue(true);

jest.mock("jsonwebtoken", () => ({
  sign: (payload: JwtPayload) => mockSignature(payload),
  verify: (token: string) => mockVerification(token),
}));

describe("Given a hasCreate function", () => {
  describe("When instantiated with a string as an argument", () => {
    test("Then it should return a promise with a string that is a hash of the argument provided", async () => {
      const password = "admin";
      const hashStart = "$2a$10$";

      const result = await hashCreator(password);

      expect(result.startsWith(hashStart)).toBe(true);
      expect(result.length > 10).toBe(true);
    });
  });
});

describe("Given a hasCompare function", () => {
  describe("When called a password and a string", () => {
    test("Then it should return false if the password doesn't match the second string", async () => {
      const password = "admin";

      const result = await hashCompare(password, password);

      expect(result).toBe(false);
    });

    test("Then it should return true if the password matches the second string, being it the correct hash", async () => {
      const password = "admin";
      const hash = await hashCreator(password);

      const result = await hashCompare(password, hash);

      expect(result).toBe(true);
    });
  });
});

describe("Given a createToken function", () => {
  describe("When called with a payload as an argument", () => {
    test("Then it should call jwt and return its returned value", () => {
      const mockToken: JwtPayload = {
        id: "1234",
        name: "aaa",
      };

      const returnedValue = createToken(mockToken);

      expect(mockSignature).toHaveBeenCalledWith(mockToken);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a verifyToken function", () => {
  describe("When called with a token and a secret as arguments", () => {
    test("It should return true if token is legit", () => {
      const mockTokenString = "12345";

      const returnedValue = verifyToken(mockTokenString);

      expect(mockVerification).toHaveBeenCalledWith(mockTokenString);
      expect(returnedValue).toBe(true);
    });
  });
});
