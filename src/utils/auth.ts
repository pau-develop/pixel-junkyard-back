import "../loadEnvironment";
import bcrypt from "bcryptjs";

const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};

export default hashCreator;
