const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dic9npjta',
  api_key: '494614195416951',
  api_secret: 'ZXP5UasDhyEz0j7m_-RG-adTZpo'
});

// Set up Multer for handling file uploads
const storage = multer.memoryStorage("");
const upload = multer({ storage: storage });

// Create a folder to store uploaded files temporarily
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Image Model
const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String
});
const Image = mongoose.model('Image', imageSchema);

// Image Upload Route
app.post('/upload', upload.single('image'), async (req, res) => {
  console.log(req.body);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Save the file on the server
  const filePath = './uploads/' + req.file.originalname;
  const fileStream = fs.createWriteStream(filePath);
  fileStream.write(req.file.buffer);
  fileStream.end();

  // Upload the file to Cloudinary
  cloudinary.uploader.upload(filePath, async (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }

    // Remove the file from the server
    fs.unlinkSync(filePath);

    // Save the image details to MongoDB
    const image = new Image({
      public_id: result.public_id,
      url: result.secure_url
    });
    await image.save();

    res.json({ public_id: result.public_id, url: result.secure_url });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});