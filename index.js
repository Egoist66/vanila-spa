import { App } from "./components/App.js";
import { useChangeName } from "./hooks/useChangeName.js";
import React from "./lib/react.js";
import { Router  } from "./lib/router.js";
import { userStore } from "./store/user.js";




const root = React.createRoot(document.getElementById("root"));
root.render({
    Component: App,
    plugins: [() => Router.setup(), () => {

        const { changeRandomName, button } = useChangeName();

        button.addEventListener("click", () => changeRandomName(userStore));
    }],
    props: {
        name: App.name,
       
    }
    
});


