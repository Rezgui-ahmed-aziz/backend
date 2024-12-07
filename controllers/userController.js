const connection = require('../config/database'); // Import the MySQL connection

// Get all users
exports.getAllUsers = (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results);
  });
};

// Get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.userId;

  connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Error fetching user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
};

// Add a new user
exports.addUser = (req, res) => {
  const { full_name, email, phone_number } = req.body;

  connection.query('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)', [full_name, email, phone_number], (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ error: 'Error adding user' });
    }

    res.status(201).json({ id: results.insertId, full_name, email, phone_number });
  });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
  const userId = req.params.userId;

  connection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};
