import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

// Mock the useUserStore hook
jest.mock('../store/useUserStore', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        signIn: jest.fn(),
        isLoading: false,
        error: null,
    })),
}));

// Mock navigation
const mockNavigation = {
    navigate: jest.fn(),
};

describe('LoginScreen', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Sign In')).toBeTruthy();
    });
});
