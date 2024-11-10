const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


const connection = mysql.createConnection({
  host: 'rescuelink.c9cc2802gn0o.ap-southeast-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'rescuelink',
  database: 'rescuelink'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});


function logRequest(req, res, next) {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
}

app.use(logRequest);

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


const { router: userRouter, setConnection: setConnectionUser } = require('./types/user');
setConnectionUser(connection);
app.use('/user', userRouter);

const { router: markerRouter, setConnectionMarker } = require('./types/marker');
setConnectionMarker(connection);
app.use('/marker', markerRouter);

const { router: serviceproviderRouter, setConnectionServiceProvider } = require('./types/serviceprovider');
setConnectionServiceProvider(connection); 
app.use('/serviceprovider', serviceproviderRouter);

const { router: servicerequestRouter, setConnectionServiceRequest } = require('./types/servicerequest');
setConnectionServiceRequest(connection); 
app.use('/servicerequest', servicerequestRouter);


const { router: adminRouter, setConnectionAdmin } = require('./types/admin');
setConnectionAdmin(connection);
app.use('/admin', adminRouter);

const { router: assistancereportRouter, setConnectionAssistanceReport } = require('./types/assistancereport');
setConnectionAssistanceReport(connection);
app.use('/assistancereport', assistancereportRouter);

const { router: barangayRouter, setConnectionBarangay } = require('./types/barangay');
setConnectionBarangay(connection);
app.use('/barangay', barangayRouter);

const { router: photoRouter, setConnectionPhoto } = require('./types/photo');
setConnectionPhoto(connection);
app.use('/photo', photoRouter);

const { router: messagingRouter, setConnectionMessaging } = require('./types/messaging');
setConnectionMessaging(connection);
app.use('/messaging', messagingRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
