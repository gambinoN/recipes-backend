import express from 'express';
import bodyParser from 'body-parser';
import { json, urlencoded } from 'body-parser';
import routes from './routes/authRoutes';
import cors from 'cors';
import 'reflect-metadata';


const app = express();

app.use(cors()); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes
app.use('/auth', routes);

app.get('/', (req, res) => {
    res.send('Welcome to the Recipes App!');
  });

export default app;
