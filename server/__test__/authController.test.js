// server/__test__/authController.__test__.js
const { describe, it, expect, beforeEach } = require('@jest/globals');
const authController = require('../controllers/authController');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { deleteSession, uploadSession, checkSession } = require('../middlewares/sessionHandler');

jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('uuid');
jest.mock('../middlewares/sessionHandler');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            cookies: {},
            session: {
                destroy: jest.fn()
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            cookie: jest.fn()
        };
    });

    describe('register', () => {
        it('should return 400 if any field is missing', async () => {
            req.body = { name: '', email: '', password: '', permissionId: '' };
            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Minden mező megadása kötelező." });
        });

        it('should return 409 if email is already taken', async () => {
            req.body = { name: 'Test', email: '__test__@example.com', password: 'password', permissionId: 1 };
            User.findOne.mockResolvedValue({ data: [{}] });
            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledWith({ message: "Az email cím már foglalt." });
        });

        it('should return 200 and save user if registration is successful', async () => {
            req.body = { name: 'Test', email: '__test__@example.com', password: 'password', permissionId: 1 };
            User.findOne.mockResolvedValue({ data: [] });
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save.mockResolvedValue({ id: 1, name: 'Test', email: '__test__@example.com' });
            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ id: 1, name: 'Test', email: '__test__@example.com' });
        });
    });

    describe('login', () => {
        it('should return 400 if session check fails', async () => {
            req.body = { email: 'idkbro@idk.com', password: 'password' };
            checkSession.mockResolvedValue(false); // Mock session check failure
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Session check failed." });
        });

        it('should return 400 if email is invalid', async () => {
            req.body = { email: 'invalid@example.com', password: 'password' };
            User.findOne.mockResolvedValue({ data: [] }); // No user found
            checkSession.mockResolvedValue({ response: false }); // Mock session check failure
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Érvénytelen email cím." });
        });



        it('should return 400 if password is invalid', async () => {
            req.body = { email: '__test__@example.com', password: 'invalidPassword' };
            User.findOne.mockResolvedValue({ data: [{ email: '__test__@example.com', hashedPassword: 'hashedPassword' }] });
            bcrypt.compare.mockResolvedValue(false); // Password does not match
            checkSession.mockResolvedValue({ response: false }); // Mock session check failure
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Érvénytelen jelszó." });
        });

        it('should return 200 and set cookies if login is successful', async () => {
            req.body = { email: '__test__@example.com', password: 'password' };
            User.findOne.mockResolvedValue({ data: [{ email: '__test__@example.com', hashedPassword: 'hashedPassword' }] });
            bcrypt.compare.mockResolvedValue(true);
            uuidv4.mockReturnValue('uuid');
            jwt.sign.mockReturnValue('token');
            await authController.login(req, res);
            expect(res.cookie).toHaveBeenCalledWith('token', 'token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Belépve új munkamenettel." });
        });
    });

    describe('logout', () => {
        it('should return 200 and set cookies if login is successful', async () => {
            req.body = { email: '__test__@example.com', password: 'password' };
            User.findOne.mockResolvedValue({ data: [{ email: '__test__@example.com', hashedPassword: 'hashedPassword' }] });
            bcrypt.compare.mockResolvedValue(true);
            uuidv4.mockReturnValue('uuid');
            jwt.sign.mockReturnValue('token');
            await authController.login(req, res);
            expect(res.cookie).toHaveBeenCalledWith('token', 'token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Belépve új munkamenettel." });
        });

        it('should return 500 if an error occurs during logout', async () => {
            req.cookies['connect.sid'] = 's:sessionId';
            deleteSession.mockRejectedValue(new Error('Error'));
            await authController.logout(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: "Hiba kijelentkezéskor.", error: expect.any(Error) });
        });
    });
});