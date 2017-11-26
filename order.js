'use latest';

const admin = require('firebase-admin');
const drinks = ['beer', 'wine', 'water', 'soda'];

module.exports = (context, cb) => {
  const { room, drink } = context.query;
  // somehow the array.prototype.includes method does not exist
  if (!room || drinks.indexOf(drink) < 0) {
    return cb(Error('Both a room and valid drink need to be supplied'));
  }
  
  if (admin.apps.length === 0) {
    const serviceAccount = JSON.parse(context.data.serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fridgeteer.firebaseio.com"
    });
  }
  
  const drinkRef = admin.database().ref(`room/${room}/${drink}`);
  drinkRef.once('value', (snapshot) => {
    const count = snapshot.val() ? snapshot.val() + 1 : 1;
    drinkRef.set(count);
    
    cb(null, { room, drink, count });
  });
  
};