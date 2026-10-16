import React from "react";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../features/tasks/tasksSlice";
import { selectCategoryById, selectTasksByCategory } from "../features/selectors";

function formatTime(time) {
  if (!time) return "Any time";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function TaskRow({ task, onEdit, onProgressChange }) {
  const dispatch = useDispatch();
  const category = useSelector((state) =>
    selectCategoryById(state, task.categoryId),
  );
  const complete = task.progress === 100;
  const handleToggle = useCallback(() => {
    onProgressChange(task.id, complete ? 0 : 100);
  }, [complete, onProgressChange, task.id]);

  return (
    <article className={`task-row ${complete ? "is-complete" : ""}`}>
      <button
        aria-label={complete ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
        className={`task-check ${complete ? "checked" : ""}`}
        onClick={handleToggle}
        type="button"
      >
        {complete ? "✓" : ""}
      </button>
      <div className="task-main">
        <button className="task-title" onClick={() => onEdit(task)} type="button">
          {task.title}
        </button>
        <div className="task-meta">
          {category && (
            <span className="task-category">
              <span
                className="category-dot"
                style={{ "--category-color": category.color }}
              />
              {category.name}
            </span>
          )}
          <span className="meta-separator">·</span>
          <span>{formatTime(task.time)}</span>
        </div>
      </div>
      <span className={`priority priority-${task.priority.toLowerCase()}`}>
        <span className="priority-dot" />
        {task.priority}
      </span>
      <div className="task-actions">
        <button
          aria-label={`Edit ${task.title}`}
          className="icon-button"
          onClick={() => onEdit(task)}
          type="button"
        >
          ✎
        </button>
        <button
          aria-label={`Delete ${task.title}`}
          className="icon-button delete-action"
          onClick={() => dispatch(deleteTask(task.id))}
          type="button"
        >
          ×
        </button>
      </div>
    </article>
  );
}

const selectVisibleTasks = (state, categoryId) =>
  selectTasksByCategory(state, categoryId);

function TaskList({ selectedCategory, onEdit, onProgressChange }) {
  const tasks = useSelector((state) =>
    selectVisibleTasks(state, selectedCategory),
  );

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>A little room to begin</h3>
        <p>Nothing on this list yet. Add a task when you’re ready.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          onEdit={onEdit}
          onProgressChange={onProgressChange}
          task={task}
        />
      ))}
    </div>
  );
}

export default memo(TaskList);