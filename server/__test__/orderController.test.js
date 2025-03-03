const request = require('supertest');
const express = require('express');
const orderController = require('../controllers/orderController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/orders', orderController.getAllOrders);
app.get('/api/orders/:id', orderController.getOrderById);
app.post('/api/orders', orderController.createOrder);
app.delete('/api/orders/:id', orderController.deleteOrder);
app.get('/api/orders/in-process', orderController.getAllInProcessOrders);
app.get('/api/orders/finished', orderController.getAllFinishedOrders);
app.get('/api/orders/served', orderController.getAllServedOrders);
app.put('/api/orders/:id/done', orderController.setDoneOrder);
app.put('/api/orders/:id/rollback-done', orderController.rollbackDoneOrder);
app.put('/api/orders/:id/served', orderController.setServedOrder);
app.put('/api/orders/:id/rollback-served', orderController.rollbackServedOrder);
app.get('/api/orders/table/:id', orderController.getOrdersByTableId);

describe('Order Controller', () => {
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
            CREATE TABLE IF NOT EXISTS category (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `, (err) => {
                if (err) return done(err);
                connect.query(`
                CREATE TABLE IF NOT EXISTS item (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    categoryId INT,
                    FOREIGN KEY (categoryId) REFERENCES category(id)
                );
            `, (err) => {
                    if (err) return done(err);
                    connect.query(`
                    CREATE TABLE IF NOT EXISTS orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        tableId INT,
                        itemId INT,
                        orderedAt DATETIME,
                        isDone BOOLEAN DEFAULT false,
                        isServed BOOLEAN DEFAULT false,
                        FOREIGN KEY (tableId) REFERENCES tables(id),
                        FOREIGN KEY (itemId) REFERENCES item(id)
                    );
                `, (err) => {
                        if (err) return done(err);
                        connect.query(`
                        INSERT INTO tables (tableNumber) VALUES (1);
                    `, (err) => {
                            if (err) return done(err);
                            connect.query(`
                            INSERT INTO category (name) VALUES ('Food'), ('Drink');
                        `, (err) => {
                                if (err) return done(err);
                                connect.query(`
                                INSERT INTO item (name, categoryId) VALUES ('Item 1', 1), ('Item 2', 2);
                            `, (err) => {
                                    if (err) return done(err);
                                    connect.query(`
                                    INSERT INTO orders (tableId, itemId, orderedAt, isDone, isServed) VALUES (1, 1, NOW(), false, false);
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
        connect.query(`DROP TABLE IF EXISTS orders;`, (err) => {
            if (err) return done(err);
            connect.query(`DROP TABLE IF EXISTS item;`, (err) => {
                if (err) return done(err);
                connect.query(`DROP TABLE IF EXISTS category;`, (err) => {
                    if (err) return done(err);
                    connect.query(`DROP TABLE IF EXISTS tables;`, (err) => {
                        if (err) return done(err);
                        done();
                    });
                });
            });
        });
    });

    describe('GET /api/orders', () => {
        it('should get all orders', async () => {
            const res = await request(app).get('/api/orders');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should get an order by the given id', async () => {
            const orderId = 1;
            const res = await request(app).get(`/api/orders/${orderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', orderId);
        });
    });

    describe('POST /api/orders', () => {
        it('should create a new order', async () => {
            const order = {
                tableId: 1,
                items: [1, 2]
            };
            const res = await request(app).post('/api/orders').send(order);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('DELETE /api/orders/:id', () => {
        it('should delete an order by the given id', async () => {
            const orderId = 1;
            const res = await request(app).delete(`/api/orders/${orderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Rendelés sikeresen törölve.');
        });
    });

    describe('GET /api/orders/in-process', () => {
        it('should get all in-process orders', async () => {
            const res = await request(app).get('/api/orders/in-process');
            expect(res.statusCode).toEqual(204);
            //no orders in process, because of sql imports
        });
    });

    describe('GET /api/orders/finished', () => {
        it('should get all finished orders', async () => {
            const res = await request(app).get('/api/orders/finished');
            expect(res.statusCode).toEqual(204);
        });
    });

    describe('GET /api/orders/served', () => {
        it('should get all served orders', async () => {
            const res = await request(app).get('/api/orders/served');
            expect(res.statusCode).toEqual(204);
        });
    });

    describe('PUT /api/orders/:id/done', () => {
        it('should set an order as done', async () => {
            const orderId = 1;
            const res = await request(app).put(`/api/orders/${orderId}/done`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Rendelés sikeresen átállitva.');
        });
    });

    describe('PUT /api/orders/:id/rollback-done', () => {
        it('should rollback an order from done', async () => {
            const orderId = 1;
            const res = await request(app).put(`/api/orders/${orderId}/rollback-done`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Rendelés sikeresen visszaállitva.');
        });
    });

    describe('PUT /api/orders/:id/served', () => {
        it('should set an order as served', async () => {
            const orderId = 1;
            const res = await request(app).put(`/api/orders/${orderId}/served`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Rendelés sikeresen átállitva.');
        });
    });

    describe('PUT /api/orders/:id/rollback-served', () => {
        it('should rollback an order from served', async () => {
            const orderId = 1;
            const res = await request(app).put(`/api/orders/${orderId}/rollback-served`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Rendelés sikeresen visszaállitva.');
        });
    });

    describe('GET /api/orders/table/:id', () => {
        it('should get orders by table id', async () => {
            const tableId = 1;
            const res = await request(app).get(`/api/orders/table/${tableId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });
});