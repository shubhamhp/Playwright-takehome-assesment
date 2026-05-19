import { Page, Locator } from "@playwright/test";

export class TodoPage {
    readonly page: Page;
    readonly input: Locator;
    readonly todoItem: Locator;
    readonly todoList: Locator;
    readonly todoCount: Locator;
    readonly allFilter: Locator;
    readonly activeFilter: Locator;
    readonly completedFilter: Locator;
    readonly todoItemDelete: Locator;
    readonly clearCompletedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.input = page.getByPlaceholder('What needs to be done?');
        this.todoList = page.getByTestId('todo-item');
        this.todoItem = page.getByRole('checkbox', { name: 'Toggle Todo' });
        this.todoCount = page.getByTestId('todo-count');
        this.allFilter = page.getByRole('link', { name: 'All' });
        this.activeFilter = page.getByRole('link', { name: 'Active' });
        this.completedFilter = page.getByRole('link', { name: 'Completed' });
        this.todoItemDelete = page.getByRole('button', { name: 'Delete' });
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    }

    /**
     * Navigates to the app home route (all todos visible).
     */
    async goto() {
        await this.page.goto('#/');
    }

    /**
     * Types a todo label into the input and submits it with Enter.
     */
    async addTodo(todo: string) {
        await this.input.fill(todo);
        await this.input.press('Enter');
    }

    /**
     * Finds the todo row matching `todo` and checks its completion checkbox.
     */
    async completeTodo(todo: string) {
        await this.todoList.filter({ hasText: todo }).getByRole('checkbox').check();
    }

    /**
     * Clicks the footer "Clear completed" button to remove completed todos from the list.
     */
    async clearCompleted() {
        await this.clearCompletedButton.click();
    }

    /**
     * Switches the list view to All, Active, or Completed using the footer filter links.
     */
    async filterBy(filter: string) {
        switch (filter) {
            case 'All':
                await this.allFilter.click();
                break;
            case 'Active':
                await this.activeFilter.click();
                break;
            case 'Completed':
                await this.completedFilter.click();
                break;
        }
    }

    /**
     * Returns a locator for one todo row, narrowed by its visible label text.
     */
    todoItemByText(text: string): Locator {
        return this.todoList.filter({ hasText: text });
    }
}
