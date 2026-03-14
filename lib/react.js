/**
 * A lightweight, vanilla JavaScript implementation of React.
 * @module react
 * @exports React
 */

const React = {
 
  createRoot(element) {
    const root =
      typeof element === "string" ? document.getElementById(element) : element;
    return {
      /**
       * Renders a React component into a given root element.
       * @param {Object} options - An object containing the following properties:
       * @param {React.Component} options.Component - The React component to render.
       * @param {Array<Function>} options.plugins - An array of functions to call after rendering.
       * @param {Object} options.props - An object containing the props to pass to the React component.
       */
      render({ Component, plugins = [() => {}], props = {} }) {
        if (root) {
          const content = Component(props)
            .replace(/<script.*?<\/script>/g, "")
            .trim();
          root.innerHTML = content;

          if (plugins.length) {
            plugins.forEach((plugin) => {
              if (typeof plugin === "function") {
                plugin();
              }
            });
          }
        }
      },
    };
  },
};

export default React;
