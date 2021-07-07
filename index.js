const server = require('./server.js');

// enable dynamic ports for hosting provider
const port = process.env.PORT || 5000;


server.listen(port, () => {
    console.log(`\n *** Server Running on ${port} *** \n`);
});