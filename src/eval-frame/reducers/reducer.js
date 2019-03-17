export default function reducer(state, action) {
  return action.type === "REPLACE_STATE" ? action.state : state;
}
