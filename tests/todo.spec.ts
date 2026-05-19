import { test, expect } from '@playwright/test';

import { TodoPage } from '../pages/Todo';

// End-to-end flow: add todos, complete one, exercise filters, then clear completed.
test.describe('Adding, Completing, and Clearing Completed Todos', () => {
    let todoPage: TodoPage;

    // Fresh page and TodoPage instance before each test so runs do not share state.
    test.beforeEach(async ({ page }) => {
        todoPage = new TodoPage(page);
        await todoPage.goto();
    });

    test('Add,Complete, and Clear Completed Todos', async () => {
        // --- Step 1: Add first todo ---
        await test.step('Step 1- Add first todo and verify', async () => {
            await todoPage.addTodo('Learn Playwright');

            // The list should show the new todo title.
            await expect(todoPage.todoList).toHaveText('Learn Playwright');
            // Footer counter reflects one active item.
            await expect(todoPage.todoCount).toHaveText('1 item left');
            // Exactly one row exists in the list.
            await expect(todoPage.todoList).toHaveCount(1);
        });

        // --- Step 2: Add second todo ---
        await test.step('Step 2 - Add second todo and verify counts', async () => {
            await todoPage.addTodo('Write tests');

            // Both todos appear in order in the list.
            await expect(todoPage.todoList).toHaveText(['Learn Playwright', 'Write tests']);
            // Counter updates to plural when there are two active items.
            await expect(todoPage.todoCount).toHaveText('2 items left');
            await expect(todoPage.todoList).toHaveCount(2);
        });

        // --- Step 3: Complete one todo ---
        await test.step('Step 3 - Complete a todo and verify ', async () => {
            await todoPage.completeTodo('Learn Playwright');

            // Target the checkbox inside the row — the row element itself is not a checkbox.
            await expect(
                todoPage.todoItemByText('Learn Playwright').getByRole('checkbox'),
            ).toBeChecked();
            // Completing frees one "item left" but does not remove the row from the All view.
            await expect(todoPage.todoCount).toHaveText('1 item left');
            await expect(todoPage.todoList).toHaveCount(2);
        });

        // --- Step 4: Completed filter ---
        await test.step('Step 4 - Verify the completed filter tab', async () => {
            await todoPage.filterBy('Completed');

            // Only the completed todo is shown on this route.
            await expect(todoPage.todoItemByText('Learn Playwright')).toBeVisible();
            await expect(todoPage.todoItemByText('Write tests')).toBeHidden();
            await expect(todoPage.todoList).toHaveCount(1);
            // Counter still reports active items left (not how many are visible in this filter).
            await expect(todoPage.todoCount).toHaveText('1 item left');
        });

        // --- Step 5: Active filter ---
        await test.step('Verify the active filter tab', async () => {
            await todoPage.filterBy('Active');

            // Completed todo is hidden; active todo remains visible.
            await expect(todoPage.todoItemByText('Learn Playwright')).toBeHidden();
            await expect(todoPage.todoItemByText('Write tests')).toBeVisible();
            await expect(todoPage.todoList).toHaveCount(1);
            await expect(todoPage.todoCount).toHaveText('1 item left');
        });

        // --- Step 6: Clear completed ---
        await test.step('Clear Completed Todos', async () => {
            // Return to All so completed rows exist in the DOM before we clear them.
            await todoPage.filterBy('All');
            await todoPage.clearCompleted();

            // Completed todo is removed from the app entirely.
            await expect(todoPage.todoItemByText('Learn Playwright')).toBeHidden();
            // Active todo is still shown.
            await expect(todoPage.todoItemByText('Write tests')).toBeVisible();
            await expect(todoPage.todoList).toHaveCount(1);
            await expect(todoPage.todoCount).toHaveText('1 item left');
        });
    });
});
