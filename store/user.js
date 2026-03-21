import { reactive } from "../lib/reactive.js";

export const userStore = reactive({
    user: {
        name: "John",
        age: 30,
    }
}, {deep: true});

const unsubscribe = userStore.subscribe("user", (name) =>
  console.log("Name changed:", name),
);

window.userStore = userStore;

// const timer = setTimeout(() => {
//   unsubscribe();
//   clearTimeout(timer);
// }, 5000);
