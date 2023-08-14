import { expect, type Locator, type Page } from '@playwright/test'
import { Task, TaskStatus } from '../types/task'

export class HomePage {
  readonly page: Page
  readonly pageHeading: Locator
  readonly statusSelect: Locator
  readonly searchInput: Locator
  readonly todoHeading: Locator
  readonly inProgressHeading: Locator
  readonly completedHeading: Locator
  readonly addTodoBtn: Locator
  readonly addInProgressBtn: Locator
  readonly addCompletedBtn: Locator
  readonly taskColumn: Locator
  readonly taskCard: Locator

  constructor(page: Page) {
    this.page = page
    this.pageHeading = page.getByRole('heading', { name: 'My tasks' })
    this.statusSelect = page.getByRole('combobox')
    this.searchInput = page.getByLabel('Search tasks')
    this.todoHeading = page.getByRole('heading').filter({ hasText: 'Todo' })
    this.inProgressHeading = page.getByRole('heading').filter({ hasText: 'In Progress' })
    this.completedHeading = page.getByRole('heading').filter({ hasText: 'Completed' })
    this.addTodoBtn = page.getByLabel('Add Todo task')
    this.addInProgressBtn = page.getByLabel('Add In Progress task')
    this.addCompletedBtn = page.getByLabel('Add Completed task')
    this.taskCard = page.getByTestId('task-card')
    this.taskColumn = page.getByTestId('task-column')
  }

  async goto() {
    await this.page.goto('http://localhost:3000')
  }

  async clickAddTodoTaskBtn() {
    await this.addTodoBtn.click()
  }

  async clickAddInProgressTaskBtn() {
    await this.addInProgressBtn.click()
  }

  async clickAddCompletedTaskBtn() {
    await this.addCompletedBtn.click()
  }

  async clickEditCard(taskTitle: string) {
    await this.taskCard.filter({ hasText: taskTitle }).click()
  }

  getTaskColumnElements(headingText: string) {
    const columnHeading = this.page.getByRole('heading').filter({ hasText: headingText })
    const taskColumn = this.taskColumn.filter({ hasText: headingText })
    const taskCards = taskColumn.getByTestId('task-card')

    return { taskColumn, taskCards, columnHeading }
  }

  async verifyEmptyTaskColumnUI(status: TaskStatus) {
    const { taskColumn, taskCards, columnHeading } = this.getTaskColumnElements(status)
    const noTasksRow = taskColumn.getByText('No tasks found.')

    await expect(columnHeading).toBeVisible()
    await expect(taskCards).not.toBeVisible()
    await expect(noTasksRow).toBeVisible()
  }

  async verifyTaskColumnUI(status: TaskStatus, numberOfTasks: number) {
    if (numberOfTasks <= 0) {
      await this.verifyEmptyTaskColumnUI(status)
    } else {
      const { taskCards, columnHeading } = this.getTaskColumnElements(`${status} (${numberOfTasks})`)
      const cardsCount = await taskCards.count()

      await expect(columnHeading).toBeVisible()
      expect(cardsCount).toBe(numberOfTasks)
    }
  }

  getTaskCardByText(text: string) {
    return this.taskCard.filter({ hasText: text }).first()
  }

  async verifyTaskCardUI(task: Task) {
    const targetCard = this.getTaskCardByText(task.title)

    await expect(targetCard.getByText(task.description)).toBeVisible()
    await expect(targetCard.locator('.chakra-badge')).toHaveText(task.status)
    await expect(targetCard.getByLabel('Delete task')).toBeVisible()
  }

  async deleteTask(taskTitle: string) {
    const targetCard = this.getTaskCardByText(taskTitle)
    const deleteBtn = targetCard.getByLabel('Delete task')

    await deleteBtn.click()
  }

  async filterTaskByStatus(status: string) {
    await this.statusSelect.selectOption(status)
  }

  async searchTask(text: string) {
    await this.searchInput.clear()
    await this.searchInput.type(text)
  }
}
