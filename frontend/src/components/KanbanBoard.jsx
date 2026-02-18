import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
    MouseSensor
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';

const KanbanBoard = React.memo(function KanbanBoard({ tasks, onMoveTask, onDeleteTask }) {

    // Sensors for better touch/mouse handling
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10, // Drag starts after 10px movement
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Press and hold for 250ms to pick up (allows scrolling)
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            onMoveTask({ id: taskId, status: newStatus });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="board-layout">
                <Column
                    id="todo"
                    title="To Do"
                    tasks={tasks.filter(t => t.status === 'todo')}
                    onDeleteTask={onDeleteTask}
                />

                <Column
                    id="inprogress"
                    title="In Progress"
                    tasks={tasks.filter(t => t.status === 'inprogress')}
                    onDeleteTask={onDeleteTask}
                />

                <Column
                    id="done"
                    title="Done"
                    tasks={tasks.filter(t => t.status === 'done')}
                    onDeleteTask={onDeleteTask}
                />
            </div>
        </DndContext>
    );
});

export default KanbanBoard;
