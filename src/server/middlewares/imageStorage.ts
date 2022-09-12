import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import Debug from "debug";
import supabase from "../../utils/supaBase";

const debug = Debug("pixel-junkyard:server:middlewares:imageStorage");

const imageStorage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { filename, originalname } = req.file;
  debug(filename, originalname);

  const storage = supabase.storage.from("pixel-junkyard");

  const newPictureName = `${Date.now()}-${originalname}`;
  await fs.rename(
    path.join("uploads", filename),
    path.join("uploads", newPictureName)
  );
  debug(newPictureName);
  const readFile = await fs.readFile(path.join("uploads", newPictureName));

  await storage.upload(newPictureName, readFile);

  const imageUrl = storage.getPublicUrl(newPictureName);

  req.body.image = imageUrl.publicURL;

  next();
};

export default imageStorage;
