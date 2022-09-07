import { model, Schema } from "mongoose";

const drawingSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    required: true,
  },
});

const Drawing = model("Drawing", drawingSchema, "drawings");

export default Drawing;
