import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call("tasks.setIsChecked", _id, !isChecked);
};

const deleteTask = ({ _id }) => {
  return Meteor.call("tasks.remove", _id);
};

const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const user = useTracker(() => Meteor.user());
  const logout = () => Meteor.logout();

  const userFilter = user ? { userId: user._id } : {};
  // kullanici filtresi, eger kullanici var ise true'daki sorguyu alir.
  const hideCompletedFilter = { isChecked: { $ne: true } };
  // isChecked'i false olanlari geri sorgusu
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  // hem kullanici girisi olmus hemde hide butonuna basildigi durumda
  const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
  // verinin olmadigi durumu gosteriyoruz

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    if (!Meteor.user()) return noDataAvailable;
    // eger user yoksa calisir

    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) return { ...noDataAvailable, isLoading: true };
    // subscribe ile alinan data hazir degilse data yok ve loading goster

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter
    ).fetch();

    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : " yok "
  }`;

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

          {isLoading && <div className="loading">loading...</div>}

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
