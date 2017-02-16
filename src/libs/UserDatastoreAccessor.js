const fs = require('fs');

class UserDatastoreAccessor {
    constructor(datastore) {
        this.dataStore = datastore;
        this.usersJson = JSON.parse(fs.readFileSync(datastore))
    }

    getMoneyOfUser(userId) {
        let usersArr = this.usersJson.users;

        let foundUser = usersArr.find((value, index, obj) => {
            return (value.id === userId);
        });

        if (foundUser !== undefined) {
            return foundUser.money;
            msg.reply("$" + foundUser.money);
        } else {
            console.log(`User with id ${userId} not found in datastore. Creating new entry`);
            usersArr.push({
                id: userId,
                money: 0
            });
            fs.writeFile(this.dataStore, JSON.stringify(this.usersJson, null, 2));
            msg.reply("$0");
        }
    }

} 

module.exports = UserDatastoreAccessor;
    



