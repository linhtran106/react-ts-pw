import { expect, test } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { TaskFormPage } from '../pages/TaskFormPage'
import { Task, TaskStatus } from '../types/task'

const TASK_STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Completed']

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

test('TC_0. it should render header correctly', async ({ page }) => {
  const homePage = new HomePage(page)

  await expect(homePage.pageHeading).toBeVisible()
})

test.describe('Test create/edit task form', () => {
  test('TC_1. it should create task successfully', async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    for (const status of TASK_STATUSES) {
      const NEW_TASK = {
        title: `Task with status ${status}`,
        description: 'lorem ipsum',
        status: status,
      }

      await homePage.verifyEmptyTaskColumnUI(status)

      await homePage.clickAddTodoTaskBtn()
      await taskFormPage.fillTaskAndSave(NEW_TASK)

      await homePage.verifyTaskColumnUI(status, 1)
      await homePage.verifyTaskCardUI(NEW_TASK)
    }
  })

  test('TC_2. it should validate empty title', async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    const status: TaskStatus = 'Todo'

    const NEW_TASK: Task = {
      title: '',
      description: 'lorem ipsum',
      status,
    }

    await homePage.clickAddTodoTaskBtn()
    await taskFormPage.fillTaskAndSave(NEW_TASK)
    await expect(taskFormPage.titleError).toBeVisible()
  })

  test('TC_3. it should not save task when clicking Cancel', async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    const status: TaskStatus = 'Todo'

    const NEW_TASK: Task = {
      title: '',
      description: 'lorem ipsum',
      status,
    }

    await homePage.clickAddTodoTaskBtn()
    await taskFormPage.fillTaskAndCancel(NEW_TASK)
    await expect(taskFormPage.newTitle).not.toBeVisible()
    await homePage.verifyEmptyTaskColumnUI(status)
  })

  test('TC_4. it should edit task successfully', async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    const NEW_TASK = {
      title: 'New task',
      description: 'lorem ipsum',
      status: 'In Progress' as TaskStatus,
    }

    const UPDATED_TASK = {
      ...NEW_TASK,
      status: 'Completed' as TaskStatus,
    }

    await homePage.clickAddTodoTaskBtn()
    await taskFormPage.fillTaskAndSave(NEW_TASK)

    await homePage.clickEditCard(NEW_TASK.title)
    await taskFormPage.verifyEditModeUI(NEW_TASK)

    await taskFormPage.fillTaskAndSave(UPDATED_TASK)
    await homePage.verifyTaskCardUI(UPDATED_TASK)
  })
})

test.describe('Test filter/search tasks', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    for (const status of TASK_STATUSES) {
      const NEW_TASK = {
        title: `Task with status ${status}`,
        description: 'lorem ipsum',
        status: status,
      }

      await homePage.clickAddTodoTaskBtn()
      await taskFormPage.fillTaskAndSave(NEW_TASK)
    }
  })

  test('TC_5. it should filter tasks by status correctly', async ({ page }) => {
    const homePage = new HomePage(page)

    for (const status of TASK_STATUSES) {
      const otherStatuses = TASK_STATUSES.filter(item => item !== status)

      await homePage.filterTaskByStatus(status)
      await homePage.verifyTaskColumnUI(status, 1)

      for (const otherStatus of otherStatuses) {
        await homePage.verifyEmptyTaskColumnUI(otherStatus)
      }
    }
  })

  test('TC_6. it should search tasks by text correctly', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchTask('status Todo')
    const cardsCountByTitle = await homePage.taskCard.count()
    expect(cardsCountByTitle).toBe(1)

    await homePage.searchTask('lorem')
    const cardsCountDescription = await homePage.taskCard.count()
    expect(cardsCountDescription).toBe(3)
  })


  test('TC_7. it should search and filter tasks correctly', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.searchTask('status Todo')
    const cardsCountBefore = await homePage.taskCard.count()
    expect(cardsCountBefore).toBe(1)

    await homePage.filterTaskByStatus('Completed')
    const cardsCountAfter = await homePage.taskCard.count()
    expect(cardsCountAfter).toBe(0)
  })
})

test.describe('Test task card functions: delete / drag & drop', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page)
    const taskFormPage = new TaskFormPage(page)

    for (const status of TASK_STATUSES) {
      const NEW_TASK = {
        title: `Task with status ${status}`,
        description: 'lorem ipsum',
        status: status,
      }

      await homePage.clickAddTodoTaskBtn()
      await taskFormPage.fillTaskAndSave(NEW_TASK)
    }
  })

  test('TC_8. it should delete task correctly', async ({ page }) => {
    const homePage = new HomePage(page)
    const status = 'Todo' as TaskStatus

    await homePage.deleteTask(`Task with status ${status}`)
    await homePage.verifyEmptyTaskColumnUI(status)
  })

  test('TC_9. it should update task status correctly when dragging to other column', async ({ page }) => {
    const homePage = new HomePage(page)
    const { taskColumn: inProgressColumn } = homePage.getTaskColumnElements('In Progress')

    const todoTask = homePage.getTaskCardByText('Task with status Todo')

    await todoTask.hover()
    await page.mouse.down()

    const box = (await inProgressColumn.boundingBox())!

    await page.mouse.move(box.width / 2, box.y)

    await inProgressColumn.hover()
    await page.mouse.up()

    await expect(todoTask.getByText('In Progress')).toBeVisible()
  })
})
