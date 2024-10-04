import mongoose from "mongoose";

const userDataSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          priority: { type: String, required: true },
          dueDate: { type: String, required: true }, // or Date if you want
          status: { type: String, required: true },
        },
      ],
      default: [
        {
          id: "1",
          title: "Task 1",
          description: "This is the first task.",
          priority: "High",
          dueDate: "2024-09-25",
          status: "To Do",
        },
        {
          id: "2",
          title: "Task 2",
          description: "This is the second task.",
          priority: "Medium",
          dueDate: "2024-09-26",
          status: "In Progress",
        },
        {
          id: "3",
          title: "Task 3",
          description: "This is the third task.",
          priority: "Low",
          dueDate: "2024-09-27",
          status: "Completed",
        },
      ],
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userDataSchema, "user_data");

export default UserData;
