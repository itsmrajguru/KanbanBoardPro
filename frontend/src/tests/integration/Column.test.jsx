import { render, screen } from '@testing-library/react';
import Column from '../../components/Column';
import { DndContext } from '@dnd-kit/core';

// need DndContext because Column uses useDroppable
const renderWithDnd = (component) => {
    return render(
        <DndContext>
            {component}
        </DndContext>
    );
};

describe('Column Component', () => {
    const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'todo' }
    ];

    test('renders column title and tasks', () => {
        renderWithDnd(<Column id="todo" title="To Do" tasks={mockTasks} onDeleteTask={() => { }} />);

        expect(screen.getByText('To Do (2)')).toBeInTheDocument();
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    test('shows no tasks message', () => {
        renderWithDnd(<Column id="todo" title="To Do" tasks={[]} onDeleteTask={() => { }} />);

        expect(screen.getByText('No tasks')).toBeInTheDocument();
    });
});
