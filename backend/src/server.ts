
import express from 'express';
import cors from 'cors';
import {port, frontendUrl} from "./config/constants.js";
import { connectDB } from "./config/mongo.js";
import urlRoutes from "./routes/url_routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";


const app = express();
connectDB(); // Connect to MongoDB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: frontendUrl, optionsSuccessStatus: 200, credentials: true}));

app.use('/', urlRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
