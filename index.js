const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

exports.notifyNewMessage = functions.firestore
    .document("messages/{newMessageDocId}")
    .onCreate((snap, context) => {
      const message = snap.data();
      const topic = "/topics/" + message.addressee;
      const payload = {
        data: {
          messageId: context.params.newMessageDocId,
          sender: message.sender,
          body: message.body,
          timerInMillis: message.timerInMillis,
          timestamp: message.timestamp,
        },
      };
      const response = app.messaging().sendToTopic(topic, payload);
      return response;
    });
