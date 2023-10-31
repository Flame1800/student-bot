import mongoose from "mongoose";

const schema = new  mongoose.Schema({
    user_id: String,
    name: String,
    group: String,
    group_id: String,
    status: String,
})


export default mongoose.model("User", schema)