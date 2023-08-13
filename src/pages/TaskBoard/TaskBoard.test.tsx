import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { TaskStatus } from '../../types'
import { TaskBoard } from './TaskBoard'
import { useTaskBoard } from './useTaskBoard'

const mockUseTaskBoard: ReturnType<typeof useTaskBoard> = {
  orderedTasks: {
    [TaskStatus.Todo]: [{
      id: 1,
      title: 'task 1',
      description: 'desc 1',
      status: TaskStatus.Todo,
    }],
    [TaskStatus.InProgress]: [{
      id: 2,
      title: 'task 2',
      description: 'desc 2',
      status: TaskStatus.InProgress,
    }],
    [TaskStatus.Completed]: [{
      id: 3,
      title: 'task 3',
      description: 'desc 3',
      status: TaskStatus.Completed,
    }]
  },
  handleSaveTask: jest.fn(),
  handleDeleteTask: jest.fn(),
  filterCriteria: { searchTerm: '' },
  handleChangeFilterCriteria: jest.fn(),
  editingTask: undefined,
  handleEditTask: jest.fn(),
  handleDragEnd: jest.fn()
}

jest.mock('./useTaskBoard', () => ({
  useTaskBoard: () => mockUseTaskBoard
}))

describe('TaskBoard', () => {
  afterEach(() => {
    cleanup()
  })

  const SELECTOR = {
    HEADING: 'My tasks',
    TASK_FILTER: 'status-select',
    TASK_COLUMN: 'task-column',
    TASK_FORM: 'title-input',
  }

  it('should render UI correctly', () => {
    render(<TaskBoard />)

    const heading = screen.getByText(SELECTOR.HEADING)
    const taskColumns = screen.getAllByTestId(SELECTOR.TASK_COLUMN)
    const taskForm = screen.queryByTestId(SELECTOR.TASK_FORM)

    expect(heading).toBeInTheDocument()
    expect(taskColumns.length).toBe(3)
    expect(taskForm).not.toBeInTheDocument()
  })

  it('should render task form correctly', () => {
    mockUseTaskBoard.editingTask = { id: 1, title: 'task 1', status: TaskStatus.Todo }
    render(<TaskBoard />)

    const heading = screen.getByText(SELECTOR.HEADING)
    const taskColumns = screen.getAllByTestId(SELECTOR.TASK_COLUMN)
    const taskForm = screen.queryByTestId(SELECTOR.TASK_FORM)

    expect(heading).toBeInTheDocument()
    expect(taskColumns.length).toBe(3)
    expect(taskForm).toBeInTheDocument()
  })
})
