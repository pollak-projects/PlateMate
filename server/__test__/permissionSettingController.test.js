const request = require('supertest');
const express = require('express');
const permissionSettingController = require('../controllers/permissionSettingController');
const { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect } = require('@jest/globals');
const connect = require('../config/db');
const app = express();

app.use(express.json());
app.get('/api/permissionSettings', permissionSettingController.getAllSettings);
app.get('/api/permissionSettings/:id', permissionSettingController.getSettingById);
app.post('/api/permissionSettings', permissionSettingController.createSetting);
app.delete('/api/permissionSettings/:id', permissionSettingController.deleteSetting);

describe('Permission Setting Controller', () => {
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
            CREATE TABLE IF NOT EXISTS permissionSettings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            );
        `, (err) => {
            if (err) return done(err);
            connect.query(`
                INSERT INTO permissionSettings (name, description) VALUES ('Admin', 'Full access'), ('User', 'Limited access');
            `, (err) => {
                if (err) return done(err);
                done();
            });
        });
    });

    afterEach((done) => {
        connect.query(`DROP TABLE IF EXISTS permissionSettings;`, (err) => {
            if (err) return done(err);
            done();
        });
    });

    describe('GET /api/permissionSettings', () => {
        it('should get all permission settings', async () => {
            const res = await request(app).get('/api/permissionSettings');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('GET /api/permissionSettings/:id', () => {
        it('should get a permission setting by the given id', async () => {
            const settingId = 1;
            const res = await request(app).get(`/api/permissionSettings/${settingId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('id', settingId);
        });
    });

    describe('POST /api/permissionSettings', () => {
        it('should create a new permission setting', async () => {
            const setting = {
                name: 'Manager',
                description: 'Manage users and settings'
            };
            const res = await request(app).post('/api/permissionSettings').send(setting);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });
    });

    describe('DELETE /api/permissionSettings/:id', () => {
        it('should delete a permission setting by the given id', async () => {
            const settingId = 1;
            const res = await request(app).delete(`/api/permissionSettings/${settingId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Permission setting successfully deleted.');
        });
    });
});