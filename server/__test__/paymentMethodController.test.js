const request = require('supertest');
const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/paymentMethods', paymentMethodController.getAllMethods);
app.get('/api/paymentMethods/:id', paymentMethodController.getMethodById);
app.post('/api/paymentMethods', paymentMethodController.createMethod);
app.delete('/api/paymentMethods/:id', paymentMethodController.deleteMethod);

describe('Payment Method Controller', () => {
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
            CREATE TABLE IF NOT EXISTS paymentMethods (
                                                          id INT AUTO_INCREMENT PRIMARY KEY,
                                                          name VARCHAR(255) NOT NULL
                );
        `, (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO paymentMethods (name) VALUES ('Cash'), ('Card');
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS paymentMethods;`, (err) => {
            if (err) return done(err);
            done();
        });
    });

    describe('GET /api/paymentMethods', () => {
        it('should get all payment methods', async () => {
            const res = await request(app).get('/api/paymentMethods');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/paymentMethods/:id', () => {
        it('should get a payment method by the given id', async () => {
            const paymentMethodId = 1;
            const res = await request(app).get(`/api/paymentMethods/${paymentMethodId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', paymentMethodId);
        });
    });

    describe('POST /api/paymentMethods', () => {
        it('should create a new payment method', async () => {
            const paymentMethod = {
                name: 'Bank Transfer'
            };
            const res = await request(app).post('/api/paymentMethods').send(paymentMethod);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('DELETE /api/paymentMethods/:id', () => {
        it('should delete a payment method by the given id', async () => {
            const paymentMethodId = 1;
            const res = await request(app).delete(`/api/paymentMethods/${paymentMethodId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Fizetési módszer sikeresen törölve.');
        });
    });
});