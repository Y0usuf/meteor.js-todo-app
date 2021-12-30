import React, { useState } from "react";
import { TasksCollection } from "../api/TasksCollection";

const TaskForm = ({ user }) => {
  const [text, setText] = useState("");

  const changeText = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text) return;

    TasksCollection.insert({
      text: text.trim(),
      createdAt: new Date(),
      isChecked: false,
      userId: user._id,
    });

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={changeText}
        value={text}
        placeholder="task giriniz"
      />

      <button type="submit">Add Task</button>
    </form>
  );
};

export { TaskForm };
