interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
}

export interface JwtPayload {
  _id: string;
  userName: string;
}

export default CustomError;
