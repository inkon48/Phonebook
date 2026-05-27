const mongoose = require("mongoose");


if (process.argv.length < 3) {
    console.log("Please, give the password");
    process.exit(1);
} 

const password = process.argv[2];
const encodedPassword = encodeURIComponent(password);

const url = `mongodb+srv://inkon601_db_user:${encodedPassword}@cluster0.uxvoyys.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });


const phonebookSchema = new mongoose.Schema({
    name: String, 
    number: String
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);


let userName;
let userNumber;

if (process.argv.length == 5) {
    userName = process.argv[3];
    userNumber = process.argv[4];

    const data = new Phonebook({
        name: userName,
        number: userNumber
    });

    data.save().then(result => {
        console.log(`added ${userName} Number ${userNumber} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log("phonebook:");
    Phonebook.find({}).then(result => {
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`);
        })
        mongoose.connection.close();
    });
}

