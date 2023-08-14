import { expect, type Locator, type Page } from '@playwright/test'
import { Task } from '../types/task'

export class TaskFormPage {
  readonly page: Page
  readonly newTitle: Locator
  readonly editTitle: Locator
  readonly titleInput: Locator
  readonly titleError: Locator
  readonly descriptionInput: Locator
  readonly statusSelect: Locator
  readonly cancelBtn: Locator
  readonly saveBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.newTitle = page.getByText('New task')
    this.editTitle = page.getByText('Edit task')
    this.titleInput = page.getByPlaceholder('Enter title')
    this.titleError = page.getByText('Title is required.')
    this.descriptionInput = page.getByPlaceholder('Enter description')
    this.statusSelect = page.getByTestId('status-input')
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
    this.saveBtn = page.getByRole('button', { name: 'Save' })
  }

  async fillTask(task: Task) {
    await this.titleInput.type(task.title)
    await this.descriptionInput.type(task.description)
    await this.statusSelect.selectOption(task.status)
  }

  async clickSaveBtn() {
    await this.saveBtn.click()
  }

  async clickCancelBtn() {
    await this.cancelBtn.click()
  }

  async fillTaskAndSave(task: Task) {
    await this.fillTask(task)
    await this.clickSaveBtn()
  }

  async fillTaskAndCancel(task: Task) {
    await this.fillTask(task)
    await this.clickCancelBtn()
  }

  async verifyCreateModeUI(defaultStatus: Task['status']) {
    expect(this.newTitle).toBeVisible()
    expect(this.titleInput).not.toHaveValue('')
    expect(this.descriptionInput).not.toHaveValue('')
    expect(this.statusSelect).toHaveValue(defaultStatus)
  }

  async verifyEditModeUI(task: Task) {
    expect(this.editTitle).toBeVisible()
    expect(this.titleInput).toHaveValue(task.title)
    expect(this.descriptionInput).toHaveValue(task.description)
    expect(this.statusSelect).toHaveValue(task.status)
  }
}
