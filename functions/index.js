// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const cors = require("cors")({ origin: true });
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});

exports.phones = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {cd
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

// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const admin = require("../config/firestore");
// const { logger } = require("firebase-functions");
// const { onRequest } = require("firebase-functions/v2/https");
// const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// // The Firebase Admin SDK to access Firestore.

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;

//   // Push the new message into Firestore using the Firebase Admin SDK.

//   const writeResult = await admin
//     .firestore()
//     .collection("messages")
//     .add({ original: original });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` });
// });

// // Listens for new messages added to /messages/:documentId/original
// // and saves an uppercased version of the message
// // to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log("Uppercasing", event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({ uppercase }, { merge: true });
// });

// exports.phones = onRequest(async (req, res) => {
//   const db = admin.firestore();

//   try {
//     // Retrieve data from the 'phones' collection
//     const phonesSnapshot = await db.collection("phones").get();

//     // Create an array to store phone data
//     const phones = [];

//     // Loop through the documents in the collection
//     phonesSnapshot.forEach((doc) => {
//       // Get the data from each document
//       const phoneData = doc.data();
//       phones.push(phoneData);
//     });

//     res.status(200).json(phones);
//   } catch (error) {
//     console.error("Error retrieving data from Firestore:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
