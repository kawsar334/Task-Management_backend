
import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    category: { type: String, enum: ["To-Do", "In Progress", "Done"], required: true, default:"To-Do" },
    userId: { type: String, required: true },
    email:{
        type: String, required: true
    }
},{timestamps:true,});


const Task = mongoose.model("Task", taskSchema);


export default Task