import mongoose from "mongoose";

const schema = new  mongoose.Schema({
    user: String,
    suggestion: String
})


export default mongoose.model("Suggestion", schema)