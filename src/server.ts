import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

import connectDB from '../config/database';
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import pet from "./routes/api/pet";
import shelter from "./routes/api/shelter";

import populateDB from "./populateDB";

import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';

import './swagger';

const app = express();

// CORS
app.use(cors());

// Connect to MongoDB
connectDB();
populateDB();

// Express configuration
app.set("port", process.env.NODE_DOCKER_PORT || 6868);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/pets", pet);
app.use("/api/shelters", shelter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
