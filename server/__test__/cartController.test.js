// __tests__/cartController.test.js
const request = require('supertest');
const express = require('express');
const cartController = require('../controllers/cartController');
const Cart = require('../models/cart');

// Mock the Mongoose model
jest.mock('../models/cart');

const app = express();
app.use(express.json());
app.post('/api/cart', cartController.createCart);
app.get('/api/cart', cartController.getCarts);
app.get('/api/cart/:id', cartController.getCartById);
app.put('/api/cart/:id', cartController.updateCart);
app.delete('/api/cart/:id', cartController.deleteCart);

describe('Cart Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock data after each test
    });

    test('should create a new cart', async () => {
        // Mock the Cart model's save method to return the expected result
        Cart.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                _id: 'someId',
                userName: 'John Doe',
                zip: '12345',
                country: 'USA',
                state: 'NY',
                phone: '123-456-7890',
                address: '123 Street',
                district: 'District 1'
            }),
        }));
    
        // Perform the request and assertions
        const response = await request(app)
            .post('/api/cart')
            .send({
                userName: 'John Doe',
                zip: '12345',
                country: 'USA',
                state: 'NY',
                phone: '123-456-7890',
                address: '123 Street',
                district: 'District 1'
            });
    
        expect(response.status).toBe(201);
        expect(response.body.userName).toBe('John Doe');
    });
    

    test('should get all carts', async () => {
        // Mock the find method on the Cart model
        Cart.find.mockResolvedValue([{ userName: 'John Doe' }]);

        // Perform the request and assertions
        const response = await request(app).get('/api/cart');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([{ userName: 'John Doe' }]));
    });

    test('should get a cart by ID', async () => {
        // Mock the findOne method on the Cart model
        Cart.findOne.mockResolvedValue({ userName: 'John Doe' });

        // Perform the request and assertions
        const response = await request(app).get('/api/cart/123');

        expect(response.status).toBe(200);
        expect(response.body.userName).toBe('John Doe');
    });

    test('should update a cart', async () => {
        // Mock the findOneAndUpdate method on the Cart model
        Cart.findOneAndUpdate.mockResolvedValue({ userName: 'John Updated' });

        // Perform the request and assertions
        const response = await request(app)
            .put('/api/cart/123')
            .send({ userName: 'John Updated' });

        expect(response.status).toBe(200);
        expect(response.body.userName).toBe('John Updated');
    });

    test('should delete a cart', async () => {
        // Mock the findOneAndDelete method on the Cart model
        Cart.findOneAndDelete.mockResolvedValue({ userName: 'John Doe' });

        // Perform the request and assertions
        const response = await request(app).delete('/api/cart/123');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted');
    });

    test('should return 404 if cart not found for get by ID', async () => {
        // Mock the findOne method on the Cart model to return null
        Cart.findOne.mockResolvedValue(null);

        // Perform the request and assertions
        const response = await request(app).get('/api/cart/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });

    test('should return 404 if cart not found for update', async () => {
        // Mock the findOneAndUpdate method on the Cart model to return null
        Cart.findOneAndUpdate.mockResolvedValue(null);

        // Perform the request and assertions
        const response = await request(app)
            .put('/api/cart/999')
            .send({ userName: 'John Updated' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });

    test('should return 404 if cart not found for delete', async () => {
        // Mock the findOneAndDelete method on the Cart model to return null
        Cart.findOneAndDelete.mockResolvedValue(null);

        // Perform the request and assertions
        const response = await request(app).delete('/api/cart/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});
