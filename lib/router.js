import { Backend } from "../components/Backend.js";
import { Frontend } from "../components/Frontend.js";
import { Main } from "../components/Main.js";

const RoutingConfig = {
  "/": Main,
  "/frontend": Frontend,
  "/backend": Backend,
};

export const Router = {
  name: "Router",
  setup() {
    this.render(null, true);
    this.navigate();

    if (document.querySelectorAll("a")) {
      const appLinks = document.querySelectorAll("a");

      appLinks.forEach((l) => {
        const href = l.getAttribute("href");
        if (href in RoutingConfig) {
          l.addEventListener("click", (e) => {
            console.log({ href });
            e.preventDefault();

            window.history.pushState({}, "", href);
            this.render(href);
          });
        }
      });
    }
  },

  render(href = null, init = false) {
    if (href && !init) {
      document.querySelector("main").innerHTML = RoutingConfig[href]();
      document.title = RoutingConfig[window.location.pathname].name;

      return;
    }

    if (window.location.pathname in RoutingConfig) {
      document.querySelector("main").innerHTML =
        RoutingConfig[window.location.pathname]();
      document.title = RoutingConfig[window.location.pathname].name;
    }
  },

  navigate() {
    window.addEventListener("popstate", (e) => {
      console.log(e);
      document.querySelector("main").innerHTML =
        RoutingConfig[window.location.pathname]();
      document.title = RoutingConfig[window.location.pathname].name;
    });
  },
};
