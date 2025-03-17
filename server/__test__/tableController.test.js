const request = require('supertest');
const express = require('express');
const tableController = require('../controllers/tableController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/tables', tableController.getAllTables);
app.get('/api/tables/:id', tableController.getTableById);
app.post('/api/tables', tableController.createTable);
app.delete('/api/tables/:id', tableController.deleteTable);

describe('Table Controller', () => {
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
            CREATE TABLE IF NOT EXISTS tables (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tableNumber INT NOT NULL
            );
        `, (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO tables (tableNumber) VALUES (1), (2);
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS tables;`, (err) => {
            if (err) return done(err);
            done();
        });
    });

    describe('GET /api/tables', () => {
        it('should get all tables', async () => {
            const res = await request(app).get('/api/tables');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/tables/:id', () => {
        it('should get a table by the given id', async () => {
            const tableId = 1;
            const res = await request(app).get(`/api/tables/${tableId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', tableId);
        });
    });

    describe('POST /api/tables', () => {
        it('should create a new table', async () => {
            const table = {
                tableNumber: 3
            };
            const res = await request(app).post('/api/tables').send(table);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('DELETE /api/tables/:id', () => {
        it('should delete a table by the given id', async () => {
            const tableId = 1;
            const res = await request(app).delete(`/api/tables/${tableId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Asztal sikeresen törölve.');
        });
    });
});