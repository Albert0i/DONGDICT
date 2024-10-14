import 'dotenv/config'
import express from 'express';
import path from 'path';
import indexRouter from './routes/index.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

app.use(express.static(path.join(process.cwd(), 'src', 'public')));
app.use(express.urlencoded({ extended: true })); // To parse form data

// Use routes
app.use('/', indexRouter());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    banner()
    console.log(`Server is running on http://localhost:${PORT}`);
});

function banner() {
    console.log(`

    ██████╗░░█████╗░███╗░░██╗░██████╗░  ██████╗░██╗░█████╗░████████╗
    ██╔══██╗██╔══██╗████╗░██║██╔════╝░  ██╔══██╗██║██╔══██╗╚══██╔══╝
    ██║░░██║██║░░██║██╔██╗██║██║░░██╗░  ██║░░██║██║██║░░╚═╝░░░██║░░░
    ██║░░██║██║░░██║██║╚████║██║░░╚██╗  ██║░░██║██║██║░░██╗░░░██║░░░
    ██████╔╝╚█████╔╝██║░╚███║╚██████╔╝  ██████╔╝██║╚█████╔╝░░░██║░░░
    ╚═════╝░░╚════╝░╚═╝░░╚══╝░╚═════╝░  ╚═════╝░╚═╝░╚════╝░░░░╚═╝░░░
    `)
}