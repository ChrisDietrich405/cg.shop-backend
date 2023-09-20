const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // Replace with the actual path to your JSON key file
require("dotenv").config();

const serviceAccount = {
  type: process.env.MY_TYPE,
  project_id: process.env.MY_PROJECT_ID,
  private_key_id: process.env.MY_PRIVATE_KEY_ID,
  private_key: process.env.MY_PRIVATE_KEY,
  client_email: process.env.MY_CLIENT_EMAIL,
  client_id: process.env.MY_CLIENT_ID,
  auth_uri: process.env.MY_AUTH_URI,
  token_uri: process.env.MY_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.MY_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.MY_CLIENT_X509_CERT_URL,
  universe_domain: process.env.MY_UNIVERSE_DOMAIN,
};

console.log(serviceAccount)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cgshopbackend-f143a.firebaseio.com", // Replace with your Firebase project's database URL
});

module.exports = admin;
