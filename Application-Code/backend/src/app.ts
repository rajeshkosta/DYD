import express from "express";
import {config} from "dotenv";
import bodyParser from "body-parser";
import cors from 'cors';
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
config();
const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())



// root route 
app.get("/", (req, res) => {
    res.send("Hello from express");
})


// routes 
import routes from "./routes/index";
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

export default app