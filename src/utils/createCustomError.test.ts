import createCustomError from "./createCustomError";

describe("Given a createCustomError function", () => {
  let testError = createCustomError(
    404,
    "Resource not available",
    "The page you requested is not available"
  );
  describe("When called with a code, a private message and a public message as arguments", () => {
    test("It should return an 'error object' with the property status code equal to the argument 'code'", () => {
      const status = 404;
      expect(testError.statusCode).toBe(status);
    });
    test("It should return an 'error object' with the property error message equal to the argument 'public message'", () => {
      const message = "The page you requested is not available";
      expect(testError.errorMessage).toBe(message);
    });
  });

  describe("When called with a code and a private message as arguments", () => {
    test("It should return an 'error object' with the property error message equal to the argument 'private message'", () => {
      testError = createCustomError(404, "Resource not available");
      const message = "Resource not available";

      expect(testError.errorMessage).toBe(message);
    });
  });
});
