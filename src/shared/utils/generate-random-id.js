export default function generateRandomId() {
  // gist.github.com/6174/6062387
  return [...Array(10)]
    .map(i => (~~(Math.random() * 36)).toString(36)) // eslint-disable-line
    .join("");
}
