import { act, renderHook } from '@testing-library/react-native';
import useChatStore from '../store/useChatStore';

// Mock Supabase client
jest.mock('../services/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn(() => ({ data: { id: '123' }, error: null })),
                })),
            })),
            select: jest.fn(() => ({
                order: jest.fn(() => ({
                    data: [], error: null
                })),
            })),
        })),
    },
}));

describe('useChatStore', () => {
    it('should add a message', () => {
        const { result } = renderHook(() => useChatStore());

        act(() => {
            result.current.addMessage({ id: '1', text: 'Hello', sender: 'user' });
        });

        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toBe('Hello');
    });
});
