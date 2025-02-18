const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const roleHandler = require('../middlewares/roleHandler');
const { beforeAll, afterAll, beforeEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

// Override NODE_ENV to use the normal database
process.env.NODE_ENV = 'development';

app.use(express.json());
app.use(cookieParser());
app.get('/api/role', roleHandler.roleCheck);

describe('Role Handler', () => {
    beforeAll((done) => {
        connect.connect((err) => {
            if (err) return done(err);
            connect.query(`
                CREATE TABLE IF NOT EXISTS user (
                                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    permissionId INT
                    );
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    afterAll((done) => {
        connect.end((err) => {
            if (err) return done(err);
            done();
        });
    });

    beforeEach((done) => {
        connect.query('TRUNCATE TABLE user;', (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO user (name, email, password, permissionId) VALUES
                                                                           ('admin', 'admin@example.com', 'password1', 1),
                                                                           ('cashier', 'cashier@example.com', 'password2', 2),
                                                                           ('chef', 'chef@example.com', 'password3', 3),
                                                                           ('waiter', 'waiter@example.com', 'password4', 4);
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('GET /api/role', () => {
        it('should return 200 and role admin for valid admin session and token', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('role', 'admin');
        });

        it('should return 200 and role cashier for valid cashier session and token', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('role', 'cashier');
        });

        it('should return 200 and role chef for valid chef session and token', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('role', 'chef');
        });

        it('should return 200 and role waiter for valid waiter session and token', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('role', 'waiter');
        });

        it('should return 401 for invalid session', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Ainvalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 401 for invalid token', async () => {
            const res = await request(app)
                .get('/api/role')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=invalidtoken']);
            expect(res.statusCode).toEqual(401);
        });
    });
});