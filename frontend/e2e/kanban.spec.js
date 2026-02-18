import { test, expect } from '@playwright/test';
import { Buffer } from 'buffer';

test.describe('Kanban Board E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // wait for tasks to load
        await page.waitForTimeout(1000);
    });

    test('should load board and chart', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Kanban Board');
        // Check columns
        await expect(page.getByText('To Do')).toBeVisible();
        await expect(page.getByText('In Progress')).toBeVisible();
        await expect(page.getByText('Done')).toBeVisible();
        // Check Chart
        await expect(page.locator('.recharts-responsive-container')).toBeVisible();
    });

    test('should add a new task with priority and category', async ({ page }) => {
        await page.click('text=Add New Task');

        await page.fill('input[placeholder="Task Title"]', 'Priority Task');
        await page.fill('textarea[placeholder="Description"]', 'Testing Dropdowns');

        // Select Priority
        await page.selectOption('select', { label: 'High Priority' }); // Selects the first select (Priority)
        // Note: TaskForm has 2 selects. simple 'select' might be ambiguous if not targeted.
        // Let's target by partial value or order if labels are not unique.
        // The first select is Priority, second is Category in TaskForm.jsx
        const selects = page.locator('select');
        await selects.nth(0).selectOption({ value: 'high' });
        await selects.nth(1).selectOption({ value: 'bug' });

        await page.click('button[type="submit"]');

        // Check if task exists
        const taskCard = page.locator('.card').filter({ hasText: 'Priority Task' });
        await expect(taskCard).toBeVisible();
        await expect(taskCard).toContainText('high');
        await expect(taskCard).toContainText('bug');
    });

    test('should upload a file', async ({ page }) => {
        await page.click('text=Add New Task');

        await page.fill('input[placeholder="Task Title"]', 'File Upload Task');

        // Create a dummy file for upload
        const buffer = Buffer.from('dummy content');
        const file = {
            name: 'test.pdf',
            mimeType: 'application/pdf',
            buffer,
        };

        // Upload file
        await page.setInputFiles('input[type="file"]', file);

        await expect(page.getByText('Selected: test.pdf')).toBeVisible();

        await page.click('button[type="submit"]');

        const taskCard = page.locator('.card').filter({ hasText: 'File Upload Task' });
        await expect(taskCard).toBeVisible();
        // Check if attachment link is visible
        await expect(taskCard.getByText('test.pdf')).toBeVisible();
    });

    test('should delete a task', async ({ page }) => {
        // first add a task to ensure there is one
        await page.click('text=Add New Task');
        await page.fill('input[placeholder="Task Title"]', 'Task to Delete');
        await page.click('button[type="submit"]');

        await expect(page.getByText('Task to Delete')).toBeVisible();

        // handle dialog
        page.on('dialog', dialog => dialog.accept());

        // find the delete button for this specific task
        const taskCard = page.locator('.card').filter({ hasText: 'Task to Delete' }).last();
        await taskCard.getByText('Delete').click();

        await expect(page.getByText('Task to Delete')).not.toBeVisible();
    });

});
