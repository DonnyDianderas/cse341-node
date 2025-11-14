const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all register (using GET)
const getAll = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('contacts').find();
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  });
};

// Get one register (using GET)
const getSingle = async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId });
  result.toArray().then((contacts) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  });
};

// Create register (using POST)
const createContact = async (req, res) => {
  const newContact = {
    
  };

  if (!newContact.firstName || !newContact.lastName || !newContact.email ||
      !newContact.favoriteColor || !newContact.birthday) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const result = await mongodb.getDatabase().db().collection('contacts').insertOne(newContact);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });  
  } else {
    res.status(500).json({ message: 'Failed to create contact.' });
  }
};

// Update register (using PUT)
const updateContact = async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const updatedContact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  const result = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, updatedContact);
  if (result.modifiedCount > 0) {
    res.status(204).send(); 
  } else {
    res.status(404).json({ message: 'Contact not found.' });
  }
};

// Delete register (using DELETE)
const deleteContact = async (req, res) => {
  const contactId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId });
  if (result.deletedCount > 0) {
    res.status(204).send();   
  } else {
    res.status(404).json({ message: 'Contact not found.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};

