import { Navbar } from "./Navbar.js"

export const App = ({name}) => {

  
    return `
        <div>
            <h1>Hello ${name}</h1>

            ${Navbar()}



            <main>
            
               
            
            </main>
        </div>
    `
}