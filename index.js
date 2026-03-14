import { App } from "./components/App.js";
import React from "./lib/react.js";
import { Router  } from "./lib/router.js";


const root = React.createRoot(document.getElementById("root"));
root.render({
    Component: App,
    plugins: [() => Router.setup()],
    props: {
        name: App.name,
       
    }
    
});


