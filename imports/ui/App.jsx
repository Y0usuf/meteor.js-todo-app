import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";

const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked,
    },
  });
};

const deleteTask = ({ _id }) => TasksCollection.remove(_id);

const App = () => {
  const user = useTracker(() => Meteor.user());
  const logout = () => Meteor.logout();

  const userFilter = user ? { userId: user._id } : {};
  // kullanicilarin kendi ekledikleri tasklari gorebilmesi icin

  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  // yazdigimiz 2 ayri sorguyu spread ile tek bir yerde topladik.

  const tasks = useTracker(() => {
    if (!user) return [];

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
  });
  const pendingTasksCount = useTracker(() => {
    if (!user) return [];

    return TasksCollection.find(pendingOnlyFilter).count();
  });
  // NOTE useTracker database ile arada bir fark oldugu zaman calisan hooks'tur.

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : " yok "
  }`;
  // NOTE pendingTasksCount sorgusu tamamlandimi pendingTasksCount'u goster onun disinda bu '' gozuksun

  return (
    <>
      {user ? (
        <>
          <div className="user">
            {user.username}
            <button type="button" onClick={logout}>
              Exit
            </button>
          </div>
          <h1>
            📝️ To-Do List
            {pendingTasksTitle}
          </h1>
          <div className="filter">
            <button onClick={() => setHideCompleted(!hideCompleted)}>
              {hideCompleted ? "Show All" : "Hide Completed"}
            </button>
          </div>

          <h3>Todo-App </h3>
          <TaskForm user={user} />
          <ul>
            {tasks.map((task) => {
              return (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export { App };
