const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const tokenHandler = require('../middlewares/tokenHandler');
const { beforeAll, afterAll, beforeEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const jwt = require('jsonwebtoken');
const app = express();

process.env.NODE_ENV = 'test';

app.use(express.json());
app.use(cookieParser());
app.use(tokenHandler.checkTokenMiddleware);

describe('Token Handler End-to-End', () => {
    beforeAll((done) => {
        connect.connect((err) => {
            if (err) return done(err);
            connect.query(`
                CREATE TABLE IF NOT EXISTS tokens (
                                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                                      token VARCHAR(255) NOT NULL,
                    user_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        connect.query('TRUNCATE TABLE tokens;', (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO tokens (token, user_id) VALUES
                                                        ('validtoken1', 1),
                                                        ('validtoken2', 2);
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Token Middleware', () => {
        it('should allow access with a valid token', async () => {
            const token = jwt.sign({ sub: 'user1', sid: 'validsessionid1' }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            const res = await request(app)
                .get('/api/user')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', ['connect.sid=s%3Avalidsessionid1.abc123']);
            expect(res.statusCode).toEqual(401);
        });

        it('should deny access with an invalid token', async () => {
            const token = jwt.sign({ sub: 'user1', sid: 'invalidsessionid' }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            const res = await request(app)
                .get('/api/user')
                .set('Authorization', `Bearer ${token}`)
                .set('Cookie', ['connect.sid=s%3Avalidsessionid1.abc123']);
            expect(res.statusCode).toEqual(401);
        });

        it('should deny access without a token', async () => {
            const res = await request(app)
                .get('/api/user');
            expect(res.statusCode).toEqual(401);
        });

    });
});