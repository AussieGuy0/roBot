import fs from 'fs'

interface User {
    id: string,
    money: number
}

interface UserStore {
    users: Array<User>
}
/**
 * Class that reads and writes to a JSON file.
 */
export class UserDatastoreAccessor {
    dataStore: string;
    usersJson: UserStore; //TODO: Fix this
    constructor(datastore: string) {
        this.dataStore = datastore;
        this.usersJson = JSON.parse(fs.readFileSync(datastore).toString())
    }

    getMoneyOfUser(userId: string) {
        let usersArr = this.usersJson.users;

        let foundUser = usersArr.find((value, index, obj) => {
            return (value.id === userId);
        });

        if (foundUser !== undefined) {
            return foundUser.money;
        } else {
            console.log(`User with id ${userId} not found in datastore. Creating new entry`);
            usersArr.push({
                id: userId,
                money: 0
            });
            fs.writeFile(this.dataStore, JSON.stringify(this.usersJson, null, 2), () => {});
            return 0;
        }
    }
} 