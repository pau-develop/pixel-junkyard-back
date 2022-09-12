export interface CustomError extends Error {
  statusCode: number;
  errorMessage: string;
}

export interface JwtPayload {
  id: string;
  userName: string;
}

export interface LoginData {
  userName: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  password: string;
  email: string;
  avatar: string;
}

export interface IUser {
  id: string;
  userName: string;
  password: string;
  avatar: string;
}

export interface IDrawing {
  id: string;
  name: string;
  description: string;
  image: string;
  artist: string;
  resolution: string;
  artistName: string;
}
