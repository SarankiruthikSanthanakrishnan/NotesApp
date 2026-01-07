const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('./app');

app.listen(port, (error) => {
  if (error) {
    console.log('Error in server setup');
  }
  console.log(`Server is running on port http://localhost:${port}`);
});
