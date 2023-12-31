// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const cors = require("cors")({ origin: true });
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing johnson", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});

exports.phones = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Retrieve data from the 'phones' collection
      const phonesSnapshot = await getFirestore().collection("phones").get();
      // Create an array to store phone data
      const phones = [];

      // Loop through the documents in the collection
      phonesSnapshot.forEach((doc) => {
        // Get the data from each document
        const phoneData = doc.data();
        phones.push(phoneData);
      });

      res.status(200).json(phones);
    } catch (error) {
      console.error("Error retrieving data from Firestore:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

exports.createclient = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: "Add information" });
    }

    if (phone.length < 7) {
      res
        .status(400)
        .json({ message: "Phone number needs to be at least 7 digits" });
    }

    if (password.length < 7) {
      res
        .status(400)
        .json({ message: "Password needs to be at least 7 characters" });
    }

    const numbers = /^[0-9]+$/;
    if (!phone.match(numbers)) {
      res
        .status(400)
        .json({ message: "Phone number can only include numbers" });
    }

    try {
      const clientsRef = getFirestore().collection("clients");

      const existingClient = await clientsRef.where("email", "==", email).get();

      if (!existingClient.empty) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Retrieve data from the 'phones' collection
      const newClient = await clientsRef.add({ name, email, phone, password });

      const { id } = newClient;
      const clientObject = {
        id,
        name,
        email,
        phone,
      };

      res.status(200).json(clientObject);
    } catch (error) {
      console.error("Error retrieving data from Firestore:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

exports.login = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Add email and password" });
    }

    try {
      // Create a reference to the cities collection
      const clientsRef = getFirestore().collection("clients");

      // Create a query against the collection
      const findUser = await clientsRef.where("email", "==", email).get();

      if (findUser.empty) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      return res.status(200).json(findUser.docs[0].data());
    } catch (error) {
      console.error("Error retrieving data from Firestore:", error);
      // res.status(500).json({ error: "Internal server error" });
    }
  });
});
