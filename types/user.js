const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


let connection;

function setConnection(conn) {
  connection = conn;
}



function validateUserData(req, res, next) {
  const { lname, fname, mname, password, birthday } = req.body;

  if (!lname || !fname || !mname || !password || !birthday) {
    return res.status(400).send('Last name, First name, Middle Name, Password, and Birthday are required');
  }

  next(); 
}




router.post('/submit', validateUserData, (req, res) => {
  const { lname, fname, mname, password, birthday, address } = req.body;

  const query = `INSERT INTO User (LastName, FirstName, MiddleName, Password, Birthday, Address) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(query, [lname, fname, mname, password, birthday, address], (error, results) => {
    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).send('Database error');
    }

    const insertedUserId = results.insertId; 
    res.status(201).json({ message: 'Data saved successfully', userId: insertedUserId });
  });
});




router.get('/getUser', (req, res) => {
  const { username, password } = req.query;

  const verify = `SELECT * FROM User WHERE Username = ? AND Password = ? AND Status = "approved" `;

  connection.query(verify, [username, password], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      const User = results[0];
      return res.status(200).json({
        id: User.UserID,
        username: User.Username,
        fname: User.FirstName,
        lname: User.LastName,
        mname: User.MiddleName,
        address: User.Address
      });
    } else {
      return res.status(401).json({ message: 'Username or password is incorrect' });
    }
  });
});

router.get('/getUserList', (req, res) => {
  const verify = 'SELECT * FROM User WHERE Status = "pending"';

  connection.query(verify, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).send('Database error');
    }

    return res.status(200).json(results.length > 0 ? results : []);
  });
});


router.put('/updateUserStatus/:newStatus', (req, res) => {
  const newStatus = req.params.newStatus; 
  const { id } = req.body;    

  console.log('Received data:', { newStatus, id });

  if (!id) {
    return res.status(400).send('Id is required');
  }

  const query = `UPDATE User SET status = ? WHERE UserID = ?`;
  const values = [newStatus, id]; 

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).send('Database error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('Status updated successfully');
  });
});


router.put('/updateUser/:newUsername', (req, res) => {
  const newUsername = req.params.newUsername; 
  const { lname, fname, mname } = req.body;    

  console.log('Received data:', { newUsername, lname, fname, mname });

  if (!lname || !fname || !mname) {
    return res.status(400).send('First name, last name, and middle name are required to identify the User');
  }

  const query = `UPDATE User SET username = ? WHERE FirstName = ? AND LastName = ? AND MiddleName = ?`;
  const values = [newUsername, fname, lname, mname]; 

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).send('Database error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('Username updated successfully backend');
  });
});

router.put('/updateStatusUser/:status', (req, res) => {
  const { status } = req.params;  // Extract the status from URL
  const { UserID } = req.body;    // Extract User ID from request body
    
  if (!UserID) {
      return res.status(400).send('UserID is required');
  }

  if (!UserID) {
    return res.status(400).send('UserID is required');
  }

  const query = 'UPDATE User SET Status = ? WHERE UserID = ?';
  const values = [status, UserID]; 

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).send('Database error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User status updated successfully');
  });
});





module.exports = { router, setConnection };
