import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  removeTodo,
  setVisibilityFilter,
  toggleTodo,
} from "./features/todos/todoSlice";
import {
  selectActiveTodosCount,
  selectAllTodos,
  selectCompletedTodosCount,
  selectFilteredTodosCount,
  selectTodos,
  selectVisibilityFilter,
} from "./features/selectors";
import { suggestNextStep } from "./features/daylightHelper";

const filters = ["All", "Active", "Completed"];
const categories = ["Work", "Personal", "Home"];
const intentions = [
  "A calmer afternoon",
  "A focused work block",
  "A little life admin",
];

function getDateLabel() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function TodoRow({ todo, onToggle, onRemove }) {
  return (
    <li className={`todo-row${todo.completed ? " is-complete" : ""}`}>
      <button
        aria-checked={todo.completed}
        aria-label={`${todo.completed ? "Mark as active" : "Complete"}: ${todo.title}`}
        className="todo-check"
        onClick={() => onToggle(todo.id)}
        role="checkbox"
        type="button"
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="todo-copy">
        <span className="todo-title">{todo.title}</span>
        <div className="todo-meta">
          <span className={`category-tag tag-${todo.category.toLowerCase()}`}>
            {todo.category}
          </span>
          <span className={`priority-tag priority-${todo.priority.toLowerCase()}`}>
            <span aria-hidden="true">●</span> {todo.priority}
          </span>
        </div>
      </div>
      <button
        aria-label={`Delete ${todo.title}`}
        className="delete-todo"
        onClick={() => onRemove(todo.id)}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}

function App() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const allTodos = useSelector(selectAllTodos);
  const visibilityFilter = useSelector(selectVisibilityFilter);
  const filteredCount = useSelector(selectFilteredTodosCount);
  const activeCount = useSelector(selectActiveTodosCount);
  const completedCount = useSelector(selectCompletedTodosCount);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [intention, setIntention] = useState(intentions[0]);
  const [notice, setNotice] = useState("");

  const handleToggle = useCallback(
    (id) => dispatch(toggleTodo(id)),
    [dispatch],
  );
  const handleRemove = useCallback(
    (id) => dispatch(removeTodo(id)),
    [dispatch],
  );
  const handleFilter = useCallback(
    (filter) => dispatch(setVisibilityFilter(filter)),
    [dispatch],
  );
  const handleAddTodo = useCallback(
    (event) => {
      event.preventDefault();
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      dispatch(
        addTodo({
          id: crypto.randomUUID(),
          title: cleanTitle,
          category,
          priority: "Whenever",
        }),
      );
      setTitle("");
      setNotice("A little step added to your list.");
    },
    [category, dispatch, title],
  );

  const suggestion = useMemo(
    () => suggestNextStep(allTodos, intention),
    [allTodos, intention],
  );

  const addSuggestion = useCallback(() => {
    if (!suggestion.todo) return;
    dispatch(toggleTodo(suggestion.todo.id));
    setNotice("Your next little step is checked off. Look at you go.");
  }, [dispatch, suggestion.todo]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a aria-label="Daylight home" className="brand" href="#top">
          <span aria-hidden="true" className="brand-mark">✳</span>
          daylight<span className="brand-light">, little by little.</span>
        </a>
        <nav aria-label="Main navigation" className="main-nav">
          <a className="nav-link active" href="#my-day">My day</a>
          <a className="nav-link" href="#little-helper">A little help</a>
        </nav>
        <a className="profile-link" href="#my-day">
          <span className="profile-avatar">a</span>
          <span>Your space</span>
        </a>
      </header>

      <main className="main-content" id="top">
        <section className="welcome">
          <div className="welcome-copy">
            <span className="date-line"><span aria-hidden="true">✳</span> {getDateLabel().toUpperCase()}</span>
            <h1>A little progress<br />is <em>still progress.</em></h1>
            <p>Make a bit of room for what matters today. You don’t have to do it all at once.</p>
          </div>
          <div className="progress-card">
            <div className="progress-copy">
              <div>
                <span className="progress-label">YOUR DAY, SO FAR</span>
                <p><strong>{completedCount}</strong> of {allTodos.length} little things done</p>
              </div>
              <span className="progress-sparkle" aria-hidden="true">✳</span>
            </div>
            <div
              aria-label={`${allTodos.length ? Math.round((completedCount / allTodos.length) * 100) : 0}% of your list complete`}
              className="progress-track"
              role="progressbar"
              aria-valuenow={allTodos.length ? Math.round((completedCount / allTodos.length) * 100) : 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${allTodos.length ? (completedCount / allTodos.length) * 100 : 0}%` }} />
            </div>
            <span className="progress-footnote">
              {activeCount === 0 && allTodos.length > 0
                ? "You did it all. Take a little bow."
                : "Every little check mark counts."}
            </span>
          </div>
        </section>

        <div className="workspace">
          <section aria-labelledby="todos-title" className="todo-panel" id="my-day">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">YOUR GENTLE GAME PLAN</span>
                <h2 id="todos-title">Today’s little list <span>{activeCount}</span></h2>
              </div>
              <span className="list-sparkle" aria-hidden="true">✳</span>
            </div>

            <form className="add-form" onSubmit={handleAddTodo}>
              <label className="visually-hidden" htmlFor="new-todo">Add a little thing to your list</label>
              <span aria-hidden="true" className="add-plus">+</span>
              <input
                id="new-todo"
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Add a little thing to your list…"
                value={title}
              />
              <label className="visually-hidden" htmlFor="todo-category">Choose a category</label>
              <select
                id="todo-category"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
              <button aria-label="Add task" className="add-button" disabled={!title.trim()} type="submit">
                Add <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="list-toolbar">
              <div aria-label="Filter tasks" className="filter-tabs" role="group">
                {filters.map((filter) => (
                  <button
                    aria-pressed={visibilityFilter === filter}
                    className={`filter-tab${visibilityFilter === filter ? " selected" : ""}`}
                    key={filter}
                    onClick={() => handleFilter(filter)}
                    type="button"
                  >
                    {filter}
                    {filter === "Active" && <span>{activeCount}</span>}
                    {filter === "Completed" && <span>{completedCount}</span>}
                  </button>
                ))}
              </div>
              <span className="count-label">{filteredCount} {filteredCount === 1 ? "thing" : "things"}</span>
            </div>

            {todos.length > 0 ? (
              <ul aria-label={`${visibilityFilter} tasks`} className="todo-list">
                {todos.map((todo) => (
                  <TodoRow key={todo.id} onRemove={handleRemove} onToggle={handleToggle} todo={todo} />
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span aria-hidden="true">✳</span>
                <h3>{visibilityFilter === "Completed" ? "Nothing checked off just yet." : "A little breathing room."}</h3>
                <p>{visibilityFilter === "Active" ? "You’ve made it through your list. Enjoy this moment." : "Add a task above whenever you’re ready."}</p>
              </div>
            )}

            <div className="list-footer">
              <span><span aria-hidden="true">♡</span> One step at a time is just fine.</span>
              {completedCount > 0 && (
                <button
                  className="clear-completed"
                  onClick={() => allTodos.filter((todo) => todo.completed).forEach((todo) => dispatch(removeTodo(todo.id)))}
                  type="button"
                >
                  Clear completed
                </button>
              )}
            </div>
          </section>

          <aside className="side-column">
            <section aria-labelledby="helper-title" className="helper-card" id="little-helper">
              <div className="helper-label">
                <span aria-hidden="true">✳</span> A LITTLE AI HELP
                <span className="demo-label">LOCAL DEMO</span>
              </div>
              <h2 id="helper-title">What feels<br />doable <em>right now?</em></h2>
              <p className="helper-description">Pick the kind of energy you have. We’ll find one small next step from your list.</p>
              <label className="visually-hidden" htmlFor="day-intention">What kind of energy do you have?</label>
              <select
                className="intention-select"
                id="day-intention"
                onChange={(event) => setIntention(event.target.value)}
                value={intention}
              >
                {intentions.map((option) => <option key={option}>{option}</option>)}
              </select>
              <div aria-live="polite" className="suggestion-box">
                <span className="suggestion-eyebrow">A THOUGHT FOR YOU</span>
                <p>{suggestion.message}</p>
                {suggestion.todo ? (
                  <>
                    <div className="suggested-task">
                      <span className="suggested-dot" />
                      <span>{suggestion.todo.title}</span>
                    </div>
                    <button className="suggestion-button" onClick={addSuggestion} type="button">
                      Mark this one done <span aria-hidden="true">↗</span>
                    </button>
                  </>
                ) : (
                  <p className="no-suggestion">Your list is clear for now. Maybe that’s the next step.</p>
                )}
              </div>
              <p className="helper-note">A tiny in-app demo, matched to your list. No external AI service.</p>
            </section>

            <section aria-label="A kind reminder" className="kind-reminder">
              <span aria-hidden="true" className="reminder-mark">“</span>
              <p>You’re allowed to do things<br />at your own pace.</p>
              <span className="reminder-caption">A LITTLE REMINDER FROM US</span>
              <span aria-hidden="true" className="reminder-flower">✳</span>
            </section>

            <section aria-label="Today's overview" className="overview-card">
              <span className="overview-label">A QUICK LITTLE LOOK</span>
              <div className="overview-row"><span>Still to do</span><strong>{activeCount}</strong></div>
              <div className="overview-row"><span>Tucked away</span><strong>{completedCount}</strong></div>
              <div className="overview-foot"><span aria-hidden="true">✳</span> That’s enough for today.</div>
            </section>
          </aside>
        </div>
      </main>

      <footer className="site-footer">
        <a aria-label="Daylight home" className="brand" href="#top">
          <span aria-hidden="true" className="brand-mark">✳</span>
          daylight<span className="brand-light">, little by little.</span>
        </a>
        <span>A softer way to get things done.</span>
        <span>Made with a little care <span aria-hidden="true">♡</span></span>
      </footer>

      <div aria-live="polite" className={`toast${notice ? " visible" : ""}`} role="status">
        <span aria-hidden="true">✳</span> {notice}
        {notice && (
          <button aria-label="Dismiss notification" onClick={() => setNotice("")} type="button">×</button>
        )}
      </div>
    </div>
  );
}

export default App;
