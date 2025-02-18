const request = require('supertest');
const express = require('express');
const openingHourController = require('../controllers/openingHourController');
const { beforeAll, afterAll, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/openingHours', openingHourController.getAllOpeningHours);
app.post('/api/openingHours', openingHourController.createOpeningHour);
app.delete('/api/openingHours/:id', openingHourController.deleteOpeningHour);

beforeAll(async () => {
    await new Promise((resolve, reject) => {
        connect.connect((err) => {
            if (err) reject(err);
            else resolve();
        });
    });

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
            CREATE TABLE IF NOT EXISTS openinghours (
                id INT AUTO_INCREMENT PRIMARY KEY,
                dayName VARCHAR(255),
                fromHour TIME,
                untilHour TIME
            )`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.query("INSERT INTO openinghours (dayName, fromHour, untilHour) VALUES ('Monday', '09:00:00', '17:00:00'), ('Tuesday', '09:00:00', '17:00:00')", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});

afterAll(async () => {
    await new Promise((resolve, reject) => {
        connect.query("DROP TABLE IF EXISTS openinghours", (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    await new Promise((resolve, reject) => {
        connect.end((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
});



    describe('Opening Hour Controller', () => {
        describe('POST /api/openingHours', () => {
            it('should create a new opening hour', async () => {
                const openingHour = {
                    day: 'Wednesday',
                    from: '09:00:00',
                    until: '17:00:00'
                };
                const res = await request(app).post('/api/openingHours').send(openingHour);
                if (res.statusCode !== 200) {
                    console.error('Error response:', res.body);
                }
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('data');
                expect(res.body.data).toHaveProperty('insertId');
            });
        });

        describe('GET /api/openingHours', () => {
            it('should get all opening hours', async () => {
                const res = await request(app).get('/api/openingHours');
                if (res.statusCode !== 200) {
                    console.error('Error response:', res.body);
                }
                expect(res.statusCode).toEqual(200);
                expect(res.body).toHaveProperty('data');
            });
        });

    describe('DELETE /api/openingHours/:id', () => {
        it('should delete an opening hour by the given id', async () => {
            const openingHourId = 1; // Replace with a valid opening hour ID
            const res = await request(app).delete(`/api/openingHours/${openingHourId}`);
            if (res.statusCode !== 200) {
                console.error('Error response:', res.body);
            }
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Időpont sikeresen törölve.');
        });
    });
});