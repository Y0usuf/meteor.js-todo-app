import { check } from "meteor/check";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({
  "tasks.insert"(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    TasksCollection.insert({
      text,
      createdAt: new Date(),
      userId: this.userId,
      isChecked: false,
    });
  },

  "tasks.remove"(taskId) {
    check(taskId, String);

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    if (!task) {
      throw new Meteor.Error("Access denied.");
    }

    TasksCollection.remove(taskId);
  },

  "tasks.setIsChecked"(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    if (!task) {
      throw new Meteor.Error("Access denied.");
    }

    TasksCollection.update(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});
