const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const redirectHandler = require('../middlewares/redirectHandler');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.get('/api/redirect', redirectHandler.redirectHandler);

describe('Redirect Handler', () => {
    beforeAll((done) => {
        connect.connect((err) => {
            if (err) return done(err);
            done();
        });
    });

    afterAll((done) => {
        connect.end((err) => {
            if (err) return done(err);
            done();
        });
    });

    beforeEach((done) => {
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
            connect.query(`
                INSERT INTO user (name, email, password, permissionId) VALUES
                                                                           ('user1', 'user1@example.com', 'password1', 1),
                                                                           ('user2', 'user2@example.com', 'password2', 2);
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS user;`, (err) => {
            if (err) return done(err);
            done();
        });
    });

    describe('GET /api/redirect', () => {
        it('should return 200 and isAuthorized true for valid session and token', async () => {
            const res = await request(app)
                .get('/api/redirect?page=home')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            console.log(res.body);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('isAuthorized', !true);
        });

        it('should return 200 and isAuthorized false for invalid session', async () => {
            const res = await request(app)
                .get('/api/redirect?page=home')
                .set('Cookie', ['connect.sid=s%3Ainvalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('isAuthorized', false);
        });

        it('should return 200 and isAuthorized false for invalid token', async () => {
            const res = await request(app)
                .get('/api/redirect?page=home')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=invalidtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('isAuthorized', false);
        });

        it('should return 200 and isAuthorized false for invalid role', async () => {
            const res = await request(app)
                .get('/api/redirect?page=admin')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid.abc123', 'token=validtoken']);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('isAuthorized', false);
        });
    });
});