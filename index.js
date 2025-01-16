require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');
const express = require('express')
const { sequelize } = require('./models');
// const passport = require('./services/auth');
const passport = require("passport");
const migrations = require('./services/migrations');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

// Set up timezone argentina for dayjs
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(process.env.DEFAULT_TIMEZONE || 'America/Argentina/Buenos_Aires');

// Setting up port
let PORT = process.env.APP_PORT || 3000;

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();


// Adding Helmet to enhance API's security
app.use(helmet());

// enabling CORS for all requests
let appOrigins = ['http://localhost:3001']
if(process.env.APP_URL){
	appOrigins = process.env.APP_URL.split(',')
}
app.use(cors({
	origin: appOrigins,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	// allow content disposition for file download
	exposedHeaders: ['Content-Disposition'],
	credentials: true
}));

// Adding middleware to parse all incoming requests as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
require("./middlewares/jwt")(passport);


//=== 4 - CONFIGURE ROUTES
//Configure Route
require('./routes/index')(app);


async function assertDatabaseConnectionOk() {
	console.log(`- Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('- Database connection OK!');
	} catch (error) {
		console.log('- Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
} 

async function init() {

	// Check database connection
  await assertDatabaseConnectionOk();

  // Checking migrations
	await migrations.checkPendingMigrations();
	// Run Migrations (if any)
	await migrations.migrate();

  //=== 5 - START SERVER
  app.listen(PORT, () => console.log('- Server running on http://localhost:' + PORT + '/'));

}

init();
