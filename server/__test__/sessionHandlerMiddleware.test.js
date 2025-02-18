const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const sessionHandler = require('../middlewares/sessionHandler');
const { beforeAll, afterAll, beforeEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

// Remove or comment out the line below to use the real database
// process.env.NODE_ENV = 'test';

app.use(express.json());
app.use(cookieParser());
app.use(sessionHandler.checkSessionMiddleware);

describe('Session Handler', () => {
    beforeAll((done) => {
        connect.connect((err) => {
            if (err) return done(err);
            connect.query(`
                CREATE TABLE IF NOT EXISTS sessions (
                                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                                        session_id VARCHAR(255) NOT NULL,
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
        connect.query('TRUNCATE TABLE sessions;', (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO sessions (session_id, user_id) VALUES
                                                               ('validsessionid1', 1),
                                                               ('validsessionid2', 2);
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Session Middleware', () => {
        it('should allow access with a valid session', async () => {
            const findSessionMock = jest.spyOn(sessionHandler, 'findSession').mockImplementation(() => Promise.resolve({ response: [{ id: 1, user_id: 1, expires: Date.now() + 10000, ip: '127.0.0.1' }] }));

            const res = await request(app)
                .get('/api/some-protected-route')
                .set('Cookie', ['connect.sid=s%3Avalidsessionid1.abc123']);
            console.log(res.body);
            expect(res.statusCode).toEqual(200);

            findSessionMock.mockRestore();
        });

        it('should deny access with an invalid session and call deleteSession', async () => {
            const deleteSessionMock = jest.spyOn(sessionHandler, 'deleteSession').mockImplementation(() => Promise.resolve());
            const findSessionMock = jest.spyOn(sessionHandler, 'findSession').mockImplementation(() => Promise.resolve({ response: [] }));

            const res = await request(app)
                .get('/api/some-protected-route')
                .set('Cookie', ['connect.sid=s%3Ainvalidsessionid.abc123']);
            expect(res.statusCode).toEqual(401);
            expect(deleteSessionMock).toHaveBeenCalled();

            deleteSessionMock.mockRestore();
            findSessionMock.mockRestore();
        });

        it('should deny access without a session', async () => {
            const res = await request(app)
                .get('/api/some-protected-route');
            expect(res.statusCode).toEqual(401);
        });

        it('should upload a session successfully', async () => {
            const uploadSessionMock = jest.spyOn(sessionHandler, 'uploadSession').mockImplementation(() => Promise.resolve({ response: { insertId: 1 } }));

            const res = await request(app)
                .post('/api/upload-session')
                .send({ sid: 'newsessionid', userId: 1, expires: Date.now() + 10000 });
            expect(res.statusCode).toEqual(200);
            expect(uploadSessionMock).toHaveBeenCalled();

            uploadSessionMock.mockRestore();
        });
    });
});