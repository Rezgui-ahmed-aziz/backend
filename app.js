const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const contactRoutes = require('./routes/contactRoutes'); 

const app = express();

app.use(bodyParser.json());

app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:userId', userController.getUserById);
app.post('/api/users', userController.addUser);
app.delete('/api/users/:userId', userController.deleteUser);

app.use('/api/contacts', contactRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
