import { cleanup, renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TaskStatus } from '../../types'
import { useTaskBoard } from './useTaskBoard'

describe('useTaskBoard', () => {
  afterEach(() => {
    cleanup()
  })

  const TASK = {
    id: 1,
    title: 'task 1',
    description: 'desc 1',
    status: TaskStatus.InProgress,
  }

  it('handleChangeFilterCriteria should work correctly', () => {
    const { result } = renderHook(() => useTaskBoard())

    act(() => {
      result.current.handleChangeFilterCriteria({ status: TaskStatus.Todo })
    })

    expect(result.current.filterCriteria).toEqual({ searchTerm: '', status: 'Todo' })
  })

  it('handleEditTask should work correctly', () => {
    const { result } = renderHook(() => useTaskBoard())

    act(() => {
      result.current.handleEditTask(TASK)
    })

    expect(result.current.editingTask).toEqual(TASK)
  })

  it('handleSaveTask should work correctly', () => {
    const { result } = renderHook(() => useTaskBoard())

    act(() => {
      result.current.handleSaveTask({ ...TASK, id: null })
    })

    const tasks = result.current.orderedTasks[TASK.status]

    expect(tasks.length).toBe(1)

    act(() => {
      result.current.handleSaveTask({ ...tasks[0], title: 'updated title' })
    })

    expect(result.current.orderedTasks[TASK.status][0].title).toBe('updated title')
  })

  it('handleDragEnd should work correctly', () => {
    const { result } = renderHook(() => useTaskBoard())

    act(() => {
      result.current.handleSaveTask({ title: 'task 1', status: TaskStatus.Todo, id: null })
      result.current.handleSaveTask({ title: 'task 2', status: TaskStatus.InProgress, id: null })
    })

    const draggedTask = result.current.orderedTasks[TaskStatus.Todo][0]

    act(() => {
      result.current.handleDragEnd({
        draggableId: String(draggedTask.id),
        source: { index: 0, droppableId: draggedTask.status },
        destination: { index: 1, droppableId: TaskStatus.InProgress },
        reason: 'DROP',
        mode: 'FLUID',
        combine: null,
        type: '',
      })
    })

    expect(result.current.orderedTasks[TaskStatus.Todo].length).toEqual(0)
    expect(result.current.orderedTasks[TaskStatus.InProgress].length).toEqual(2)
  })
})
