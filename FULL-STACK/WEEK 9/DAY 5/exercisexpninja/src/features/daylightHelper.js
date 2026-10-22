const prompts = {
  "A calmer afternoon": {
    category: "Personal",
    message: "A softer plan: make a little room to breathe before your next thing.",
  },
  "A focused work block": {
    category: "Work",
    message: "One thing at a time. Here is a work task you can give your attention to.",
  },
  "A little life admin": {
    category: "Home",
    message: "A small practical win can make the rest of the day feel lighter.",
  },
};

export function suggestNextStep(todos, intention) {
  const prompt = prompts[intention] || prompts["A calmer afternoon"];
  const activeTodos = todos.filter((todo) => !todo.completed);
  const matchingTodo = activeTodos.find((todo) => todo.category === prompt.category);
  const nextTodo =
    matchingTodo ||
    activeTodos.find((todo) => todo.priority === "Focus") ||
    activeTodos[0];

  return {
    message: prompt.message,
    todo: nextTodo || null,
  };
}
