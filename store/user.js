import { reactive } from "../lib/reactive.js";

// Глубокая реактивность - userStore.user.name = "X" вызовет колбэк
export const userStore = reactive(
  { name: "John", age: 25 },
  
  { deep: false }
);

const unsubscribe = userStore.subscribe("name", (user) =>
  console.log("User changed:", user)
);

window.userStore = userStore;

// Тест в консоли:
// userStore.user.name = "Jane"  → должен вызвать колбэк (deep: true)
// userStore.user = { name: "Bob", age: 30 }  → тоже вызовет колбэк

// const timer = setTimeout(() => {
//   unsubscribe();
//   clearTimeout(timer);
// }, 5000);
