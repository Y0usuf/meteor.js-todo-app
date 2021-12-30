import { Mongo } from "meteor/mongo";

const TasksCollection = new Mongo.Collection("tasks");

export { TasksCollection };
