// import da classe Router do express
import { Router } from "express";

// instancia da classe Router
const routes = new Router();

// rota raiz
routes.get("/", (req, res) => res.json({
  message: "Hello World!",
}));

// export do routes
export default routes;
