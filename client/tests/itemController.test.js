const request = require('supertest');
const express = require('express');
const itemController = require('../controllers/itemController.js');
const {describe, it, expect} = require("@jest/globals");
const app = express();
const { beforeAll, afterAll } = require('@jest/globals');
const connect = require('../config/db');

app.use(express.json());
app.get('/api/items', itemController.getAllItems);
app.get('/api/items/:id', itemController.getItemById);
app.post('/api/items', itemController.createItem);
app.delete('/api/items/:id', itemController.deleteItem);

beforeAll(async () => {
    // Ensure the connection is established
    await new Promise((resolve, reject) => {
        connect.connect((err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    // Set up the __test__ database
    await new Promise((resolve, reject) => {
        connect.query("CREATE DATABASE IF NOT EXISTS test_vizsgaremek", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.query("USE test_vizsgaremek", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.query(`
            CREATE TABLE IF NOT EXISTS category (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255)
            )`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.query(`
            CREATE TABLE IF NOT EXISTS item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                price DECIMAL(10, 2),
                categoryId INT,
                FOREIGN KEY (categoryId) REFERENCES category(id)
            )`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    // Insert __test__ data into the category table
    await new Promise((resolve, reject) => {
        connect.query("INSERT INTO category (name) VALUES ('Category 1'), ('Category 2'), ('Category 3')", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    // Insert __test__ data into the item table
    await new Promise((resolve, reject) => {
        connect.query("INSERT INTO item (name, price, categoryId) VALUES ('Item 1', 10.99, 1), ('Item 2', 12.99, 2), ('Item 3', 15.99, 3)", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

afterAll(async () => {
    // Tear down the __test__ tables
    await new Promise((resolve, reject) => {
        connect.query("DROP TABLE IF EXISTS item", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.query("DROP TABLE IF EXISTS category", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    // Close the connection
    await new Promise((resolve, reject) => {
        connect.end((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

describe('Item Controller', () => {
    describe('GET /api/items', () => {
        it('should get all items', async () => {
            const res = await request(app).get('/api/items');
            if (res.statusCode !== 200) {
                console.error('Error response:', res.body);
            }
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/items/:id', () => {
        it('should get an item by the given id', async () => {
            const itemId = 1; // Replace with a valid item ID
            const res = await request(app).get(`/api/items/${itemId}`);
            if (res.statusCode !== 200) {
                console.error('Error response:', res.body);
            }
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', itemId);
        });
    });

    describe('POST /api/items', () => {
        it('should create a new item', async () => {
            const item = {
                name: 'Test Item',
                price: 10.99,
                categoryId: 1 // Replace with a valid category ID
            };
            const res = await request(app).post('/api/items').send(item);
            if (res.statusCode !== 200) {
                console.error('Error response:', res.body);
            }
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('insertId');
        });
    });

    describe('DELETE /api/items/:id', () => {
        it('should delete an item by the given id', async () => {
            const itemId = 1; // Replace with a valid item ID
            const res = await request(app).delete(`/api/items/${itemId}`);
            if (res.statusCode !== 200) {
                console.error('Error response:', res.body);
            }
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Étel sikeresen törölve.');
        });
    });
});