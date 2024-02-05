import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@/App.tsx";
import { QueryProvider } from "@/lib/react-query/QueryProvider.tsx";
import PWAContextProvider from "@/ccontext/PWAContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <PWAContextProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </PWAContextProvider>
  </BrowserRouter>
);

// Credit

const consoleHead = [
  "color: yellow",
  "text-align: center",
  "width: 100%",
  "display: block",
  "text-shadow: 2px 2px black",
  "padding: 10px",
].join(";");
const consoleBody = [
  "color: #78b5d5",
  "text-align: center",
  "width: 100%",
  "margin-block: -2.5rem -2rem",
  "display: block",
  "padding: 10px",
].join(";");
const consoleFooter = [
  "color: lime",
  "text-align: center",
  "width: 100%",
  "display: block",
  "text-shadow: 2px 2px black",
].join(";");
console.log(
  `%cCreated by\n%c
   ██████╗ ███╗   ███╗██╗██████╗     ██╗  ██╗ █████╗      ██╗██╗███████╗ █████╗ ██████╗ ███████╗██╗  ██╗
  ██╔═══██╗████╗ ████║██║██╔══██╗    ██║  ██║██╔══██╗     ██║██║╚══███╔╝██╔══██╗██╔══██╗██╔════╝██║  ██║
  ██║   ██║██╔████╔██║██║██║  ██║    ███████║███████║     ██║██║  ███╔╝ ███████║██║  ██║█████╗  ███████║
  ██║   ██║██║╚██╔╝██║██║██║  ██║    ██╔══██║██╔══██║██   ██║██║ ███╔╝  ██╔══██║██║  ██║██╔══╝  ██╔══██║
  ╚██████╔╝██║ ╚═╝ ██║██║██████╔╝    ██║  ██║██║  ██║╚█████╔╝██║███████╗██║  ██║██████╔╝███████╗██║  ██║
   ╚═════╝ ╚═╝     ╚═╝╚═╝╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
  \n%cFind me: https://omidhajizadeh.vercel.app/`,
  consoleHead,
  consoleBody,
  consoleFooter
);
