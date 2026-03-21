import { createReactiveStore } from "../lib/reactive";

export const userStore = createReactiveStore({
  name: "John Doe",
  age: 30,
});

userStore.subscribe("name", (name) => console.log("Name changed:", name));
