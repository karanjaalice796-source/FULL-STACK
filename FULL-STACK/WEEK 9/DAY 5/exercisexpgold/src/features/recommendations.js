const goalCategories = {
  "A slower morning": ["Home", "On the go"],
  "A happier workspace": ["Desk", "Home"],
  "A thoughtful little gift": ["Home", "On the go", "Desk"],
};

export function getRecommendations(products, cartItems, goal) {
  const cartIds = new Set(cartItems.map((item) => item.id));
  const cartCategories = new Set(cartItems.map((item) => item.category));
  const preferredCategories = goalCategories[goal] || [];

  return products
    .filter((product) => !cartIds.has(product.id))
    .map((product) => ({
      product,
      score:
        (preferredCategories.includes(product.category) ? 2 : 0) +
        (cartCategories.has(product.category) ? 1 : 0),
    }))
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.product.price - second.product.price,
    )
    .slice(0, 2)
    .map(({ product }) => product);
}
