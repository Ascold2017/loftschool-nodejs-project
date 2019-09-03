const mongoose = require('mongoose');

// Use native promises
mongoose.Promise = global.Promise; // es6 promise

const connectionURL = `mongodb://admin:admin123@ds213178.mlab.com:13178/loftschool-node`;

mongoose.connect(connectionURL, { useNewUrlParser: true })
.catch((e) => console.error(e));
const db = mongoose.connection;

// Check connection
db.on('connected', () => {
    console.log(`Mongoose connection open on ${connectionURL}`)
});

// Check for Db errors
db.on('error', (err) => console.error(err));

// Check for disconected
db.on('disconnected', () => {
    console.log('mongoose connection disconnected')
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('mongoose connection closed throw app terminatatnio');
        process.exit(0);
    });
});
