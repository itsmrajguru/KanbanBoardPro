import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../../components/TaskForm';
import { vi } from 'vitest';

describe('TaskForm Component', () => {

    test('renders form fields', () => {
        render(<TaskForm onAdd={() => { }} onCancel={() => { }} />);

        expect(screen.getByPlaceholderText('Task Title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    test('validates empty title', () => {
        // mock alert
        window.alert = vi.fn();

        render(<TaskForm onAdd={() => { }} onCancel={() => { }} />);

        fireEvent.click(screen.getByText('Add Task'));

        expect(window.alert).toHaveBeenCalledWith('Title is required!');
    });

    test('calls onAdd with correct data', () => {
        const handleAdd = vi.fn();
        render(<TaskForm onAdd={handleAdd} onCancel={() => { }} />);

        fireEvent.change(screen.getByPlaceholderText('Task Title'), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Desc' } });

        fireEvent.click(screen.getByText('Add Task'));

        expect(handleAdd).toHaveBeenCalledTimes(1);
        expect(handleAdd).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Task',
            description: 'Test Desc',
            status: 'todo'
        }));
    });

});
