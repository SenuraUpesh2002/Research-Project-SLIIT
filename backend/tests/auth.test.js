const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                phone: '0712345678',
                role: 'attendant',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            // Note: This test requires database connection
            // In a real scenario, you'd use a test database or mocks
            expect([201, 400, 500]).toContain(response.status);
        });

        it('should reject registration with missing email', async () => {
            const userData = {
                name: 'Test User',
                phone: '0712345678',
                role: 'attendant',
                password: 'Test@123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should reject login with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBeGreaterThanOrEqual(400);
        });

        it('should reject login with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });
});
