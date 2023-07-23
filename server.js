const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3000

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.${process.env.MONGODB_DATABASE}/outfit-picker?retryWrites=true&w=majority`);
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.${process.env.MONGODB_DATABASE}/outfit-picker?retryWrites=true&w=majority`
    console.log('Connected to database.')

    app.listen(port, () => {
        console.log(`Listening on port ${port}!`)
    });
}