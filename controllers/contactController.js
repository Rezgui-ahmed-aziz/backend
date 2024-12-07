const connection = require('../config/database');

// Add a new contact
const { sendSMSNotification, sendEmailNotification } = require('../services/notificationService'); // Import the notification service

exports.addContact = (req, res) => {
  const { userId, name, email, phone_primary, phone_secondary } = req.body;

  console.log('Request body:', req.body);

  if (!userId || !name || !email || !phone_primary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  connection.query(
    'INSERT INTO contacts (user_id, name, email, phone_primary, phone_secondary) VALUES (?, ?, ?, ?, ?)',
    [userId, name, email, phone_primary, phone_secondary],
    (err, results) => {
      if (err) {
        console.error('Error adding contact:', err.message);
        return res.status(500).json({ error: 'Error adding contact', details: err.message });
      }

      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, userResults) => {
        if (err) {
          console.error('Error fetching user by email:', err.message);
          return res.status(500).json({ error: 'Error checking email', details: err.message });
        }

        if (userResults.length > 0) {
          const user = userResults[0];
          const message = `${name} has added you as a contact.`;

          // Send notification based on user preference
          if (user.notification_preference === 'email' || user.notification_preference === 'both') {
            sendEmailNotification(user.email, 'New Contact Added', message);
          }
          if (user.notification_preference === 'sms' || user.notification_preference === 'both') {
            sendSMSNotification(user.phone, message);
          }
        }
      });

      res.status(201).json({
        id: results.insertId,
        userId,
        name,
        email,
        phone_primary,
        phone_secondary,
      });
    }
  );
};
// Get all contacts of a user
exports.getContacts = (req, res) => {
  const userId = req.params.Uid;

  connection.query('SELECT * FROM contacts WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching contacts:', err);
      return res.status(500).json({ error: 'Error fetching contacts' });
    }
    res.json(results);
  });
};

// Search for contacts by name, email, or phone number
exports.searchContacts = (req, res) => {
  const userId = req.params.userId;
  const query = req.query.query;

  connection.query('SELECT * FROM contacts WHERE user_id = ? AND (name LIKE ? OR email LIKE ? OR phone_primary LIKE ?)', 
    [userId, `%${query}%`, `%${query}%`, `%${query}%`], 
    (err, results) => {
      if (err) {
        console.error('Error searching contacts:', err);
        return res.status(500).json({ error: 'Error searching contacts' });
      }

      res.json(results);
  });
};

// Remove a contact
exports.removeContact = (req, res) => {
    const userId = req.params.userId;
    const contactId = req.params.contactId;
  
    connection.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId], (err, contactResults) => {
      if (err) {
        console.error('Error fetching contact:', err.message);
        return res.status(500).json({ error: 'Error fetching contact', details: err.message });
      }
  
      if (contactResults.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
  
      const contact = contactResults[0];
  
      connection.query('DELETE FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId], (err, results) => {
        if (err) {
          console.error('Error removing contact:', err.message);
          return res.status(500).json({ error: 'Error removing contact', details: err.message });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Contact not found' });
        }
  
        connection.query('SELECT * FROM users WHERE email = ?', [contact.email], (err, userResults) => {
          if (err) {
            console.error('Error fetching user by email:', err.message);
            return;
          }
  
          if (userResults.length > 0) {
            const user = userResults[0];
            const message = `Your contact ${contact.name} has been removed.`;
  
            if (user.notification_preference === 'email' || user.notification_preference === 'both') {
              sendEmailNotification(user.email, 'Contact Removed', message);
            }
            if (user.notification_preference === 'sms' || user.notification_preference === 'both') {
              sendSMSNotification(user.phone, message);
            }
          }
        });
  
        res.status(200).json({ message: 'Contact removed successfully' });
      });
    });
  };
  
