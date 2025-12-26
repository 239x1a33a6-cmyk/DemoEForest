const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the data directory
app.use('/data', express.static(path.join(__dirname, 'data')));

// Basic route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Backend Status</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f0fdf4;
                    color: #166534;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    text-align: center;
                    background: white;
                    padding: 3rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                h1 { margin: 0 0 1rem 0; font-size: 2.5rem; }
                p { font-size: 1.2rem; color: #4b5563; }
                .status { 
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: #dcfce7;
                    color: #15803d;
                    border-radius: 9999px;
                    font-weight: 600;
                    margin-top: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hiii 👋</h1>
                <p>Backend Server is Running Successfully!</p>
                <div class="status">● Active on Port ${PORT}</div>
                <p style="margin-top: 2rem; font-size: 0.9rem; color: #9ca3af;">
                    Available Endpoints:<br>
                    <a href="/api/dashboard-data" style="color: #2563eb;">/api/dashboard-data</a><br>
                    <a href="/api/national-stats" style="color: #2563eb;">/api/national-stats</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// API Endpoint to serve dashboard data
app.get('/api/dashboard-data', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'fra_dashboard_data.json');
    res.sendFile(dataPath);
});

// API Endpoint to serve national stats
app.get('/api/national-stats', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'fra_national_stats.json');
    res.sendFile(dataPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
