// src/__test__/components/ProductList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProductList from '../components/ProductList'; // Adjust the path as needed
import { getProducts } from '../utils/api'; // Corrected path for the mock

// Mock the API call
jest.mock('../../utils/api');

describe('ProductList Component', () => {
  // Mock localStorage
  let localStorageMock;
  beforeEach(() => {
    localStorageMock = (() => {
      let store = {};
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        }
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders product list correctly', async () => {
    // Arrange
    const products = [
      { productId: '1', productName: 'Product 1', productClass: 'Class A', stockAvailability: 10, price: 100, imageUrl: 'image1.jpg' },
      { productId: '2', productName: 'Product 2', productClass: 'Class B', stockAvailability: 20, price: 200, imageUrl: 'image2.jpg' }
    ];
    getProducts.mockResolvedValue(products);

    // Act
    render(<ProductList />);
    
    // Assert
    expect(await screen.findByText('Name: Product 1')).toBeInTheDocument();
    expect(await screen.findByText('Name: Product 2')).toBeInTheDocument();
  });

  test('displays error message on API error', async () => {
    // Arrange
    getProducts.mockRejectedValue(new Error('Error fetching products.'));

    // Act
    render(<ProductList />);

    // Assert
    expect(await screen.findByText('Error fetching products.')).toBeInTheDocument();
  });

  test('adds product to cart and updates localStorage', async () => {
    // Arrange
    const products = [
      { productId: '1', productName: 'Product 1', productClass: 'Class A', stockAvailability: 10, price: 100, imageUrl: 'image1.jpg' }
    ];
    getProducts.mockResolvedValue(products);

    // Act
    render(<ProductList />);
    const addButton = await screen.findByText('Add to Cart');
    fireEvent.click(addButton);

    // Assert
    const cart = JSON.parse(localStorage.getItem('cart'));
    expect(cart).toEqual([{ ...products[0], quantity: 1 }]);
  });

  test('cart icon displays the correct number of items', async () => {
    // Arrange
    const products = [
      { productId: '1', productName: 'Product 1', productClass: 'Class A', stockAvailability: 10, price: 100, imageUrl: 'image1.jpg' }
    ];
    getProducts.mockResolvedValue(products);

    // Act
    render(<ProductList />);
    const addButton = await screen.findByText('Add to Cart');
    fireEvent.click(addButton);

    // Assert
    const cartIcon = screen.getByTestId('cart');
    expect(cartIcon).toHaveAttribute('data-totalitems', '1');
  });

  test('triggers shake animation when item is added to cart', async () => {
    // Arrange
    const products = [
      { productId: '1', productName: 'Product 1', productClass: 'Class A', stockAvailability: 10, price: 100, imageUrl: 'image1.jpg' }
    ];
    getProducts.mockResolvedValue(products);

    // Act
    render(<ProductList />);
    const addButton = await screen.findByText('Add to Cart');
    fireEvent.click(addButton);

    // Assert
    const cartIcon = screen.getByTestId('cart');
    expect(cartIcon).toHaveClass('shake');
  });
});
