import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { TaskStatus } from '../../types'
import { TaskList } from './TaskList'

describe('TaskList', () => {
  const editFn = jest.fn()
  const deleteFn = jest.fn()
  const dragEndFn = jest.fn()

  const TASKS = [
    {
      id: 1,
      title: 'task 1',
      description: 'desc 1',
      status: TaskStatus.Todo,
    },
    {
      id: 2,
      title: 'task 2',
      description: 'desc 2',
      status: TaskStatus.Todo,
    }
  ]

  const props = {
    tasks: TASKS,
    onEditTask: editFn,
    onDeleteTask: deleteFn,
    status: 'Todo',
  }

  afterEach(() => {
    cleanup()
  })

  const SELECTOR = {
    HEADING: `${props.status} (${props.tasks.length})`,
    ADD_BTN: 'add-btn',
    TASK_CARD: 'task-card',
    DELETE_BTN: 'delete-btn',
  }

  it('should render UI correctly', () => {
    render(<DragDropContext onDragEnd={dragEndFn}><TaskList {...props} /></DragDropContext>)

    const heading = screen.getByText(SELECTOR.HEADING)
    const cards = screen.getAllByTestId(SELECTOR.TASK_CARD)

    expect(heading).toBeInTheDocument()
    expect(cards.length).toBe(2)
  })

  it('Add button should work correctly', () => {
    render(<DragDropContext onDragEnd={dragEndFn}><TaskList {...props} /></DragDropContext>)

    const addBtn = screen.getByTestId(SELECTOR.ADD_BTN)

    fireEvent.click(addBtn)

    expect(editFn).toBeCalledWith({ status: 'Todo', title: '', description: '', id: null })
  })

  it('Delete button should work correctly', () => {
    render(<DragDropContext onDragEnd={dragEndFn}><TaskList {...props} /></DragDropContext>)

    const deleteBtns = screen.getAllByTestId(SELECTOR.DELETE_BTN)

    fireEvent.click(deleteBtns[0])

    expect(deleteFn).toBeCalledWith(TASKS[0].id)
  })

  it('Delete button should work correctly', () => {
    render(<DragDropContext onDragEnd={dragEndFn}><TaskList {...props} /></DragDropContext>)

    const taskCards = screen.getAllByTestId(SELECTOR.TASK_CARD)

    const draggableTask = taskCards[0]

    fireEvent.mouseDown(draggableTask)
    fireEvent.mouseMove(draggableTask, {
      clientX: 100,
      clientY: 100,
    })
    fireEvent.mouseUp(draggableTask)

    expect(dragEndFn).toBeCalledTimes(1)
  })
})
