'use latest';

const admin = require('firebase-admin');

module.exports = (context, cb) => {
  const { room, drink } = context.query;
  // somehow the array.prototype.includes method does not exist
  if (!room) {
    return cb(Error("Please supply which room you're serving"));
  }
  
  if (admin.apps.length === 0) {
    const serviceAccount = JSON.parse(context.data.serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fridgeteer.firebaseio.com"
    });
  }
  
  const roomRef = admin.database().ref(`room/${room}`);
  roomRef.set({});
  
  cb(null, { room });
};