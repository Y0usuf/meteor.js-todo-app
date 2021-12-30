import React from "react";

const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  return (
    <>
      <li>
        <input
          type="checkbox"
          checked={task.isChecked}
          onClick={() => onCheckboxClick(task)}
          readOnly
        />
        {task.text}
        <button onClick={() => onDeleteClick(task)}>&times;</button>
      </li>
    </>
  );
};

export { Task };
