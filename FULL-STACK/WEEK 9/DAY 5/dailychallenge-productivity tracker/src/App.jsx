import React from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategorySelector from "./components/CategorySelector";
import TaskList from "./components/TaskList";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "./features/categories/categoriesSlice";
import {
  selectCompletedTasks,
  selectTasksByCategory,
} from "./features/selectors";
import {
  addTask,
  editTask,
  updateTaskProgress,
} from "./features/tasks/tasksSlice";

const initialTaskForm = {
  title: "",
  categoryId: "",
  time: "",
  priority: "Normal",
};

const categoryColors = ["#6688b8", "#8c9ec0", "#6caaa6", "#9294c5", "#78a9c4"];

function getTodayLabel() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function TaskDialog({ task, categories, onClose, onSave }) {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          categoryId: categories.some((category) => category.id === task.categoryId)
            ? task.categoryId
            : categories[0]?.id || "",
          time: task.time,
          priority: task.priority,
        }
      : { ...initialTaskForm, categoryId: categories[0]?.id || "" },
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.categoryId) return;
    onSave({ ...form, id: task?.id });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        aria-labelledby="task-dialog-title"
        aria-modal="true"
        className="dialog-card"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">MAKE A LITTLE PLAN</span>
            <h2 id="task-dialog-title">{task ? "Edit task" : "Add a task"}</h2>
          </div>
          <button aria-label="Close dialog" className="icon-button" onClick={onClose} type="button">×</button>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            What would you like to do?
            <input
              autoFocus
              maxLength={100}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="A small step is still a step"
              required
              value={form.title}
            />
          </label>
          <div className="form-row">
            <label>
              Category
              <select
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                required
                value={form.categoryId}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Time
              <input
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                type="time"
                value={form.time}
              />
            </label>
          </div>
          <label>
            How important does it feel?
            <select
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
              value={form.priority}
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
            </select>
          </label>
          <div className="dialog-footer">
            <button className="button button-quiet" onClick={onClose} type="button">Cancel</button>
            <button className="button button-primary" type="submit">
              {task ? "Save changes" : "Add to my day"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CategoryDialog({ categories, onClose, onAdd, onEdit, onDelete }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [selectedColor, setSelectedColor] = useState(categoryColors[0]);

  const handleAdd = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, color: selectedColor });
    setName("");
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        aria-labelledby="category-dialog-title"
        aria-modal="true"
        className="dialog-card category-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">YOUR LITTLE CORNERS</span>
            <h2 id="category-dialog-title">Organize your day</h2>
          </div>
          <button aria-label="Close dialog" className="icon-button" onClick={onClose} type="button">×</button>
        </div>
        <p className="dialog-description">Keep your lists close to the different parts of your life.</p>
        <div className="category-manage-list">
          {categories.map((category) => (
            <div className="category-manage-row" key={category.id}>
              <span className="category-dot" style={{ "--category-color": category.color }} />
              {editingId === category.id ? (
                <form
                  className="category-inline-edit"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (editingName.trim()) onEdit({ ...category, name: editingName });
                    setEditingId(null);
                  }}
                >
                  <input
                    aria-label="Category name"
                    autoFocus
                    maxLength={30}
                    onChange={(event) => setEditingName(event.target.value)}
                    value={editingName}
                  />
                  <button aria-label="Save category name" className="icon-button" type="submit">✓</button>
                </form>
              ) : (
                <>
                  <span className="category-manage-name">{category.name}</span>
                  <button
                    aria-label={`Edit ${category.name}`}
                    className="icon-button"
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                    type="button"
                  >✎</button>
                  <button
                    aria-label={`Delete ${category.name}`}
                    className="icon-button delete-action"
                    onClick={() => onDelete(category.id)}
                    type="button"
                  >×</button>
                </>
              )}
            </div>
          ))}
        </div>
        <form className="category-add-form" onSubmit={handleAdd}>
          <label htmlFor="new-category">Add a category</label>
          <div className="category-add-controls">
            <input
              id="new-category"
              maxLength={30}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Home"
              value={name}
            />
            <button className="button button-primary" type="submit">Add</button>
          </div>
          <div aria-label="Choose a category color" className="color-picker">
            {categoryColors.map((color) => (
              <button
                aria-label={`Choose color ${color}`}
                aria-pressed={selectedColor === color}
                className={`color-choice ${selectedColor === color ? "selected" : ""}`}
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ "--category-color": color }}
                type="button"
              />
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const tasks = useSelector((state) => state.tasks.items);
  const completedCount = useSelector(selectCompletedTasks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleTasks = useSelector((state) =>
    selectTasksByCategory(state, selectedCategory),
  );
  const totalCount = tasks.length;
  const dayProgress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const openNewTask = useCallback(() => {
    setTaskToEdit(null);
    setTaskDialogOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setTaskToEdit(task);
    setTaskDialogOpen(true);
  }, []);

  const handleProgressChange = useCallback((id, progress) => {
    dispatch(updateTaskProgress({ id, progress }));
  }, [dispatch]);

  const handleTaskSave = useCallback((task) => {
    if (task.id) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }
    setTaskDialogOpen(false);
    setTaskToEdit(null);
    setNotice(task.id ? "Your changes are saved." : "Task added to your list.");
  }, [dispatch]);

  const handleCategoryDelete = (id) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return;
    dispatch(deleteCategory(id));
    if (selectedCategory === id) setSelectedCategory("all");
    setNotice(`“${category.name}” was removed. Its tasks are still in your day.`);
  };

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a aria-label="Daymark home" className="brand" href="#">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">daymark<span>.</span></span>
        </a>
        <div className="sidebar-label">YOUR SPACE</div>
        <button className="nav-item nav-item-active" onClick={() => setSelectedCategory("all")} type="button">
          <span className="nav-icon">▦</span>
          My day
          <span className="nav-count">{totalCount}</span>
        </button>
        <div className="sidebar-section-heading">
          <span className="sidebar-label">CATEGORIES</span>
          <button
            aria-label="Manage categories"
            className="small-add-button"
            onClick={() => setCategoryDialogOpen(true)}
            type="button"
          >+</button>
        </div>
        <nav aria-label="Task categories" className="sidebar-categories">
          {categories.map((category) => (
            <button
              className={`nav-item ${selectedCategory === category.id ? "nav-item-active" : ""}`}
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              type="button"
            >
              <span className="category-dot" style={{ "--category-color": category.color }} />
              {category.name}
              <span className="nav-count">
                {tasks.filter((task) => task.categoryId === category.id).length}
              </span>
            </button>
          ))}
        </nav>
        <button
          className="add-category-link"
          onClick={() => setCategoryDialogOpen(true)}
          type="button"
        >
          <span>+</span> Add a category
        </button>
        <div className="sidebar-bottom">
          <div className="quote-mark">“</div>
          <p>One step at a time is enough.</p>
          <span>A NOTE TO SELF</span>
        </div>
        <div className="profile-row">
          <div className="profile-avatar">A</div>
          <div className="profile-copy"><strong>Your space</strong><span>One day at a time</span></div>
          <span className="profile-menu">···</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Your space <span>/</span> <strong>My day</strong></div>
          <div className="topbar-date"><span className="calendar-icon">▦</span>{getTodayLabel()}</div>
        </header>
        <section className="welcome-section">
          <div className="welcome-copy">
            <span className="eyebrow">{getTodayLabel().toUpperCase()} <span className="eyebrow-dot">·</span> YOUR DAY</span>
            <h1>{greeting}.</h1>
            <p>Here’s what’s on your list today. Take it one thing at a time.</p>
          </div>
          <div aria-hidden="true" className="sun-illustration">
            <span className="sun-core" />
            <span className="sun-orbit sun-orbit-one" />
            <span className="sun-orbit sun-orbit-two" />
          </div>
        </section>
        <section aria-label="Today's progress" className="progress-card">
          <div className="progress-card-copy">
            <span className="progress-kicker">TODAY SO FAR</span>
            <h2>{completedCount === totalCount && totalCount > 0 ? "You got it done. Nice work." : "A good start."}</h2>
            <p>
              {completedCount === 0
                ? "Nothing checked off yet. Pick one place to start."
                : `${completedCount} of ${totalCount} ${totalCount === 1 ? "task" : "tasks"} done so far.`}
            </p>
          </div>
          <div className="progress-ring-wrap">
            <div
              aria-label={`${dayProgress}% of tasks complete`}
              className="progress-ring"
              role="img"
              style={{ "--progress": `${dayProgress * 3.6}deg` }}
            >
              <span>{dayProgress}<small>%</small></span>
            </div>
            <span className="progress-ring-caption">YOUR PACE</span>
          </div>
        </section>
        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <span className="eyebrow">THE LITTLE THINGS</span>
              <h2>Today’s list <span className="task-count-pill">{visibleTasks.length}</span></h2>
            </div>
            <button className="button button-primary add-task-button" onClick={openNewTask} type="button">
              <span>+</span> Add a task
            </button>
          </div>
          <CategorySelector
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <TaskList
            onEdit={handleEditTask}
            onProgressChange={handleProgressChange}
            selectedCategory={selectedCategory}
          />
          <div className="list-footer">
            <span>Plans change. Your list can too.</span>
          </div>
        </section>
        <footer className="page-footer">
          <span>Your day, at your own pace.</span>
          <span className="footer-heart">♥</span>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          <span className="toast-check">✓</span>{notice}
          <button aria-label="Dismiss notification" onClick={() => setNotice("")} type="button">×</button>
        </div>
      )}
      {taskDialogOpen && (
        <TaskDialog
          categories={categories}
          onClose={() => setTaskDialogOpen(false)}
          onSave={handleTaskSave}
          task={taskToEdit}
        />
      )}
      {categoryDialogOpen && (
        <CategoryDialog
          categories={categories}
          onAdd={(category) => dispatch(addCategory(category))}
          onClose={() => setCategoryDialogOpen(false)}
          onDelete={handleCategoryDelete}
          onEdit={(category) => dispatch(editCategory(category))}
        />
      )}
    </div>
  );
}

export default App;