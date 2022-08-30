import CustomError from "../interfaces/interfaces";

const createCustomError = (
  code: number,
  privateMessage: string,
  publicMessage?: string
): CustomError => {
  const error = new Error(privateMessage) as CustomError;
  error.statusCode = code;
  error.errorMessage = publicMessage ?? privateMessage;

  return error;
};

export default createCustomError;
