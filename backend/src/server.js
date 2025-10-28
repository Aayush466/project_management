import app from './app.js';
import connectDB from './config/db.js';
import environmentVariables from './config/env.js';

connectDB();
app.listen(environmentVariables.port, () => console.log(`Server running on port ${environmentVariables.port}`));
