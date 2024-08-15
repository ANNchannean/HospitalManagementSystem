import { handler } from './build/handler.js';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

// app.use(express.static('uploads'));

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(5173, () => {
	console.log(`listening on port http://localhost:5173`);
});
