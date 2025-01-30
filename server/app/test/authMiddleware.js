const request = require('supertest');
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

// Simule l'appli avec une route
const app = express();
app.use((req, res, next) => {
    req.user = { id: 1, email: 'user@example.com' }; // Simule un user connecté
    next();
});
app.use(authMiddleware);
app.get('/protected', (req, res) => res.status(200).json({ message: 'Authorized' }));

describe('Auth Middleware', () => {
    test('should block unauthorized users (no token)', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
    });

    test('should allow access with a valid token', async () => {
        const validToken = 'Bearer valid.jwt.token'; // Simule token valide
        const response = await request(app)
            .get('/protected')
            .set('Authorization', validToken);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Authorized');
    });

    test('should block access with an invalid token', async () => {
        const invalidToken = 'Bearer invalid.token';
        const response = await request(app)
            .get('/protected')
            .set('Authorization', invalidToken);
        expect(response.status).toBe(401);
    });
});
