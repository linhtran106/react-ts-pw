import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TaskStatus } from '../../types'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  const closeFn = jest.fn()
  const saveFn = jest.fn()

  const BLANK_TASK = {
    id: null,
    title: '',
    description: '',
    status: TaskStatus.Todo,
  }

  const TASK = {
    id: 1,
    title: 'task 1',
    description: 'desc 1',
    status: TaskStatus.InProgress,
  }

  const props = {
    task: TASK,
    onClose: closeFn,
    onSave: saveFn,
  }

  afterEach(() => {
    cleanup()
  })

  const SELECTOR = {
    NEW_HEADING: 'New task',
    EDIT_HEADING: 'Edit task',
    TITLE_ERROR: 'Title is required.',
    TITLE_INPUT: 'title-input',
    DESCRIPTION_INPUT: 'description-input',
    STATUS_INPUT: 'status-input',
    CANCEL_BTN: 'Cancel',
    SAVE_BTN: 'Save',
  }

  it('should render new task form correctly', () => {
    render(<TaskForm {...props} task={BLANK_TASK} />)

    const heading = screen.getByText(SELECTOR.NEW_HEADING)
    const titleInput = screen.getByTestId(SELECTOR.TITLE_INPUT)
    const descriptionInput = screen.getByTestId(SELECTOR.DESCRIPTION_INPUT)
    const statusInput = screen.getByTestId(SELECTOR.STATUS_INPUT)

    expect(heading).toBeInTheDocument()
    expect(titleInput).toHaveValue('')
    expect(descriptionInput).toHaveValue('')
    expect(statusInput).toHaveValue('Todo')
  })

  it('should render edit task form correctly', () => {
    render(<TaskForm {...props} />)

    const heading = screen.getByText(SELECTOR.EDIT_HEADING)
    const titleInput = screen.getByTestId(SELECTOR.TITLE_INPUT)
    const descriptionInput = screen.getByTestId(SELECTOR.DESCRIPTION_INPUT)
    const statusInput = screen.getByTestId(SELECTOR.STATUS_INPUT)

    expect(heading).toBeInTheDocument()
    expect(titleInput).toHaveValue(TASK.title)
    expect(descriptionInput).toHaveValue(TASK.description)
    expect(statusInput).toHaveValue(TASK.status)
  })

  it('should validate title correctly', () => {
    render(<TaskForm {...props} />)

    const titleInput = screen.getByTestId(SELECTOR.TITLE_INPUT)
    const saveBtn = screen.getByRole('button', { name: SELECTOR.SAVE_BTN })

    fireEvent.change(titleInput, { target: { value: '' } })
    fireEvent.click(saveBtn)

    const titleError = screen.getByText(SELECTOR.TITLE_ERROR)

    expect(titleError).toBeInTheDocument()
    expect(saveFn).not.toHaveBeenCalled()
  })

  it('Save btn should work correctly', () => {
    render(<TaskForm {...props} />)

    const titleInput = screen.getByTestId(SELECTOR.TITLE_INPUT)
    const saveBtn = screen.getByRole('button', { name: SELECTOR.SAVE_BTN })

    fireEvent.change(titleInput, { target: { value: 'updated title' } })
    fireEvent.click(saveBtn)

    expect(saveFn).toBeCalledWith({ ...TASK, title: 'updated title' })
  })

  it('Cancel btn should work correctly', () => {
    render(<TaskForm {...props} />)

    const cancelBtn = screen.getByRole('button', { name: SELECTOR.CANCEL_BTN })

    fireEvent.click(cancelBtn)

    expect(closeFn).toHaveBeenCalled()
  })
})
