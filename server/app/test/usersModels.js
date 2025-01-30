const mongoose = require('mongoose');
const User = require('../models/user');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    test('should create a user with valid properties', async () => {
        const user = new User({ name: 'Alice', email: 'alice@example.com', password: 'securepass' });
        await user.save();

        expect(user._id).toBeDefined();
        expect(user.name).toBe('Alice');
        expect(user.email).toBe('alice@example.com');
    });

    test('should not create a user with an invalid email', async () => {
        try {
            const user = new User({ name: 'Bob', email: 'invalid-email', password: 'password123' });
            await user.save();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    test('should hash the password before saving', async () => {
        const user = new User({ name: 'Charlie', email: 'charlie@example.com', password: 'mypassword' });
        await user.save();

        expect(user.password).not.toBe('mypassword'); // Le mdp haché
    });
});
