import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

const TaskForm = () => {
  const [text, setText] = useState("");

  const changeText = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text) return;

    Meteor.call("tasks.insert", text);

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
