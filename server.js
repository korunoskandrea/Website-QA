const app = require ('./app/app');
const mongoose = require ('mongoose');

mongoose.connect('url')
.then( () => {
    app.listen(3000, () => {
    console.log("Now listening on port 3000");
    });
}).catch(err => console.log('Error while connecting with database:', err))