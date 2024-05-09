var database = require("../db/Agent");
const { ObjectId } = require('mongodb');
var crypto = require('crypto');
const { setSharingDeletedFriend } = require("./noteModel");


class userModel {
    async getAllUsers() {
        const db = await database.connectToServer();
        const users = db.collection("Users").find({});
        return await users.toArray();
    }

    async getUserById(userId) {
        const db = await database.connectToServer();
        return await db.collection("Users").findOne({ _id: new ObjectId(userId) });
    }

    async createNewUser(newUser) {
        const db = await database.connectToServer();

        // Comprobar si el correo electrónico ya está en uso
        const existingUser = await db.collection("Users").findOne({ email: newUser.email });
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const result = await db.collection("Users").insertOne(newUser);
        return result.insertedId;
    }


    async updateUserById(userId, updateQuery) {
        var findQuery = { _id: new ObjectId(userId) };

        const updateOptions = { returnOriginal: false };
        const db = await database.connectToServer();
        const updateResult = db.collection("Users").findOneAndUpdate(
            findQuery,
            updateQuery,
            updateOptions,
        );

        return updateResult
    }

    async deleteUserById(userId) {
        const db = await database.connectToServer();
        return await db.collection("Users").deleteOne({ _id: new ObjectId(userId) });
    }

    async login(email, password) {
        const db = await database.connectToServer();
        const user = await db.collection("Users").findOne({ email: email });
        password = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password === password) {
            return user;
        }
    }

    async createFriendshipRequest(senderId, receiverEmail) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");

        const senderUserId = new ObjectId(senderId);
        const sender = await usersCollection.findOne({ _id: senderUserId });
        const user = await usersCollection.findOne({ email: receiverEmail });
        if (user) {
            const userId = user._id;
            const userIdString = user._id.toString();
            if (sender.friend_requests && sender.friend_requests.includes(userIdString)) {
                throw new Error("User already sent a request");
            }
            if (senderId === userIdString) {
                throw new Error("You cannot send a friend request to yourself");
            }
            if (user.friend_requests) {
                if (user.friend_requests.includes(senderId)) {
                    throw new Error("User already has a request from this sender");
                }
                // Si el campo "friend_requests" existe, agregamos el receiverId a la lista
                await usersCollection.updateOne(
                    { _id: userId },
                    { $addToSet: { friend_requests: senderId } }
                );
            } else {
                // Si el campo "friend_requests" no existe, lo creamos como una lista con receiverId
                await usersCollection.updateOne(
                    { _id: userId },
                    { $set: { friend_requests: [senderId] } }
                );
            }
        } else {
            // Manejar el caso en que el usuario no se encuentre
            throw new Error("User not found");
        }


        return true;
    }

    async getFriendshipRequests(userId) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        console.log(user)
        console.log(user.friend_requests)
        if (user.friend_requests) {
            // Convertir los IDs de friend_requests a ObjectId
            const friendRequestIds = user.friend_requests.map(id => new ObjectId(id));
            // Utilizar los IDs convertidos en la consulta
            const friendRequests = await usersCollection.find(
                { _id: { $in: friendRequestIds } },
                { projection: { _id: 1, userName: 1, email: 1 } }
            ).toArray();
            console.log(friendRequests);
            return friendRequests;
        }
        return [];
    }

    async setFriendshipRequest(userId, friendId, status) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user.friend_requests || !user.friend_requests.includes(friendId)) {
            throw new Error("Friend request not found");
        }

        if (status === "true") {
            // Agregar a la lista de amigos del usuario
            await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { friends: friendId } }
            );
            // Agregar a la lista de amigos del amigo
            await usersCollection.updateOne(
                { _id: new ObjectId(friendId) },
                { $addToSet: { friends: userId } }
            );
        }
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friend_requests: friendId } }
        );

        return friendId;
    }

    async getFriends(userId) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (user.friends) {
            const friendIds = user.friends.map(id => new ObjectId(id));
            const friends = await usersCollection.find(
                { _id: { $in: friendIds } },
                { projection: { _id: 1, userName: 1, email: 1 } }
            ).toArray();

            for (const friend of friends) {
                let sharedFound = false;

                const notes = await db.collection("Notes").find({ user_id: friend._id.toString() }).toArray();

                for (const note of notes) {
                    if (note.readers !== undefined && note.readers.includes(userId)) {
                        friend.sharing = true;
                        sharedFound = true;
                        break;
                    }
                    if (note.editors !== undefined && note.editors.includes(userId)) {
                        friend.sharing = true;
                        sharedFound = true;
                        break;
                    }
                }

                if (!sharedFound) {
                    friend.shared = false;
                }
            }

            return friends;
        }

        return [];
    }

    async deleteFriend(userId, friendId) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        const friend = await usersCollection.findOne({ _id: new ObjectId(friendId) });

        if (!user || !friend) {
            throw new Error("Friend not found");
        }

        // Verificar si el amigo está presente en la lista de amigos
        if (!user.friends.includes(friendId) || !friend.friends.includes(userId)) {
            throw new Error("User is not a friend");
        }

        // Eliminar al amigo de la lista de amigos del usuario
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friends: friendId } }
        );

        // Eliminar al usuario de la lista de amigos del amigo
        await usersCollection.updateOne(
            { _id: new ObjectId(friendId) },
            { $pull: { friends: userId } }
        );

        await setSharingDeletedFriend(userId, friendId);

        return friendId;
    }

    async checkFriendship(userId, friendId) {
        const db = await database.connectToServer();
        const usersCollection = db.collection("Users");
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.friends || !user.friends.includes(friendId)) {
            return false;
        }
        return true;
    }


}

module.exports = new userModel();