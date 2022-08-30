interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
}

export default CustomError;
