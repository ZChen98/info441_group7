import mongoose from "mongoose";

// Connect to the mongodb database
dbConnect().catch((err) => console.error(err));

let db = {};

async function dbConnect() {
  await mongoose.connect("mongodb+srv://info441projectUser:info441project@cluster0.y5q08.mongodb.net/info441GroupProject?retryWrites=true&w=majority");
  console.log("connected to the database");

  const buildingSchema = new mongoose.Schema({
    buildingname: String,
    rating: [Number]
  });
  db.Building = mongoose.model("Building", buildingSchema);

  const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    building: { type: mongoose.Schema.Types.ObjectId, ref: "Building" },
    likes: [String],
    created_date: Date
  });
  db.Comment = mongoose.model("Comment", commentSchema);
  console.log("created db schemas and models");
}

export default db;
