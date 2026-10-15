import React from "react";
import { useSelector } from "react-redux";

const selectCategories = (state) => state.categories.items;

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}) {
  const categories = useSelector(selectCategories);

  return (
    <div className="category-tabs" aria-label="Filter tasks by category">
      <button
        className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
        onClick={() => onSelectCategory("all")}
        type="button"
      >
        Everything
      </button>
      {categories.map((category) => (
        <button
          className={`category-tab ${selectedCategory === category.id ? "active" : ""}`}
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          type="button"
        >
          <span
            className="category-dot"
            style={{ "--category-color": category.color }}
          />
          {category.name}
        </button>
      ))}
    </div>
  );
}