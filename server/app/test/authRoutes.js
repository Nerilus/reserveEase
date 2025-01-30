const request = require('supertest');
const app = require('../../main');
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Auth Routes', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    test('should register a user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    test('should not register a user with an existing email', async () => {
        await User.create({ email: 'duplicate@example.com', password: 'securepass' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'duplicate@example.com', password: 'newpass' });

        expect(res.status).toBe(400);
    });

    test('should not login with incorrect password', async () => {
        await User.create({ email: 'user@example.com', password: 'password123' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'wrongpassword' });

        expect(res.status).toBe(401);
    });
});
