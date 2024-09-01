import { authChecker } from "../../middleware/auth.check.middleware.js";
import { Tasks } from "../../models/schema.js";
import express from "express";
import { addTaskValidation } from "../../validation/tasks.validation.js";

const tasksRouter = express.Router();

/* Task CRUD requests */

// To get all tasks //

tasksRouter.get("/", authChecker, async (req, response) => {
  try {
    let userId = req?.user?.id;
    const users = await Tasks.find({ addedBy: userId });
    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    response.status(500).send({ message: "Error fetching Tasks" });
  }
});

// To create a task

tasksRouter.post("/add-task", authChecker, async (request, response) => {
  try {
    const addedBy = request?.user?.id;
    console.log(request?.user?.id);
    const { title, description, status, dueDate } = request?.body || {};

    const { error } = addTaskValidation(request?.body);
    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return response.status(400).send({ message: "All fields are required" });
    }

    const newTask = {
      title: title,
      description: description,
      status: status,
      dueDate: dueDate,
      addedBy: addedBy,
    };

    const task = await Tasks.create(newTask);
    console.log("Created");

    return response.status(201).send(task);
  } catch (error) {
    console.log("error creating:", error);
    response.status(500).send({ message: "Error creating task" });
  }
});

// To delete a specified task

tasksRouter.delete(
  "/delete-task/:id",
  authChecker,
  async (request, response) => {
    try {
      const { id } = request?.params;
      const task = await Tasks.findById(id);
      if (!task) {
        return response.status(404).send({ message: "Task not found!" });
      }
      await task.deleteOne({ id });
      return response
        .status(200)
        .send({ message: "Task deleted successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: "Error deleting task" });
    }
  }
);

// To update a task

tasksRouter.put("/edit-task/:id", authChecker, async (request, response) => {
  try {
    const { title, description, status, dueDate } = request?.body ?? {};

    const { error } = addTaskValidation(request?.body);
    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return response.status(400).send({ message: "All fields are required" });
    }

    const { id } = request.params;
    const result = await Tasks.findByIdAndUpdate(id, {
      title,
      description,
      status,
      dueDate,
    });
    if (!result) {
      return response.status(404).send({ message: "Task not found" });
    }
    return response.status(201).send({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: "Error updating task" });
  }
});

export default tasksRouter;
