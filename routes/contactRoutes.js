const express = require('express');
const router = express.Router();
const {
  addContact,
  removeContact,
  getContacts,
  searchContacts,
} = require('../controllers/contactController.js');

router.post('/', addContact); 

router.delete('/:userId/:contactId', removeContact);

router.get('/:Uid', getContacts);

router.get('/:userId/search', searchContacts);

module.exports = router;
