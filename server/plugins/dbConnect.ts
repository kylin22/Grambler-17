import mongoose from "mongoose";
import { color } from "../../src/utils/logColors";
import { useNuxtApp } from "nuxt/app";

export default async () => {
  const config = useNuxtApp().$config
  const MONGO_URI = config.dbURI as string;
    if (!MONGO_URI) return console.log(color("text",`🍃 Mongo URI not found, ${color("error", "skipping.")}`))
    mongoose.connect(`${MONGO_URI}`)
    .then(() => console.log(color("text",`🍃 MongoDB connection has been ${color("variable", "established.")}`)))
    .catch(() => console.log(color("text",`🍃 MongoDB connection has been ${color("error", "failed.")}`)))
}
