const request = require('supertest');
const express = require('express');
const paidController = require('../controllers/paidController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/paid', paidController.getAllPayments);
app.get('/api/paid/:id', paidController.getPaymentById);
app.post('/api/paid', paidController.createPayment);
app.delete('/api/paid/:id', paidController.deletePayment);

describe('Paid Controller', () => {
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
                CREATE TABLE IF NOT EXISTS item (
                                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                                    name VARCHAR(255) NOT NULL,
                    price DECIMAL(10, 2) NOT NULL
                    );
            `, (err) => {
                if (err) return done(err);
                connect.query(`
                    CREATE TABLE IF NOT EXISTS paymentMethods (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL
                    );
                `, (err) => {
                    if (err) return done(err);
                    connect.query(`
                        CREATE TABLE IF NOT EXISTS paid (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            tableId INT,
                            itemId INT,
                            paymentMethodId INT,
                            paidAt DATETIME,
                            FOREIGN KEY (tableId) REFERENCES tables(id),
                            FOREIGN KEY (itemId) REFERENCES item(id),
                            FOREIGN KEY (paymentMethodId) REFERENCES paymentMethods(id)
                        );
                    `, (err) => {
                        if (err) return done(err);
                        connect.query(`
                            INSERT INTO tables (tableNumber) VALUES (1);
                        `, (err) => {
                            if (err) return done(err);
                            connect.query(`
                                INSERT INTO item (name, price) VALUES ('Item 1', 10.00), ('Item 2', 5.00);
                            `, (err) => {
                                if (err) return done(err);
                                connect.query(`
                                    INSERT INTO paymentMethods (name) VALUES ('Cash'), ('Card');
                                `, (err) => {
                                    if (err) return done(err);
                                    connect.query(`
                                        INSERT INTO paid (tableId, itemId, paymentMethodId, paidAt) VALUES (1, 1, 1, NOW());
                                    `, (err) => {
                                        if (err) return done(err);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS paid;`, (err) => {
            if (err) return done(err);
            connect.query(`DROP TABLE IF EXISTS paymentMethods;`, (err) => {
                if (err) return done(err);
                connect.query(`DROP TABLE IF EXISTS item;`, (err) => {
                    if (err) return done(err);
                    connect.query(`DROP TABLE IF EXISTS tables;`, (err) => {
                        if (err) return done(err);
                        done();
                    });
                });
            });
        });
    });

    describe('GET /api/paid', () => {
        it('should get all paid orders', async () => {
            const res = await request(app).get('/api/paid');
            console.log(res.body);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/paid/:id', () => {
        it('should get a paid order by the given id', async () => {
            const paidOrderId = 1;
            const res = await request(app).get(`/api/paid/${paidOrderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', paidOrderId);
        });
    });

    describe('POST /api/paid', () => {
        it('should create a new paid order', async () => {
            const paidOrder = {
                tableId: 1,
                items: [1, 2],
                paymentMethodId: 1
            };
            const res = await request(app).post('/api/paid').send(paidOrder);
            console.log(res.body);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('DELETE /api/paid/:id', () => {
        it('should delete a paid order by the given id', async () => {
            const paidOrderId = 1;
            const res = await request(app).delete(`/api/paid/${paidOrderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Kifizetés sikeresen törölve.');
        });
    });
});