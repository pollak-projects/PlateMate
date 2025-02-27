const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/users', userController.getAllUsers);
app.get('/api/users/:id', userController.getUserById);
app.delete('/api/users/:id', userController.deleteUser);

describe('User Controller', () => {
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
            CREATE TABLE IF NOT EXISTS permissionsettings (
                                                              id INT AUTO_INCREMENT PRIMARY KEY,
                                                              section VARCHAR(255) NOT NULL
                );
        `, (err) => {
            if (err) return done(err);
            connect.query(`
                CREATE TABLE IF NOT EXISTS user (
                                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    permissionId INT,
                    FOREIGN KEY (permissionId) REFERENCES permissionsettings(id)
                    );
            `, (err) => {
                if (err) return done(err);
                connect.query(`
                    INSERT INTO permissionsettings (section) VALUES ('admin'), ('user');
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
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS user;`, (err) => {
            if (err) return done(err);
            connect.query(`DROP TABLE IF EXISTS permissionsettings;`, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('GET /api/users', () => {
        it('should get all users', async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get a user by the given id', async () => {
            const userId = 1;
            const res = await request(app).get(`/api/users/${userId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.data[0]).toHaveProperty('id', userId);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user by the given id', async () => {
            const userId = 1;
            const res = await request(app).delete(`/api/users/${userId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Felhasználó sikeresen törölve.');
        });
    });
});