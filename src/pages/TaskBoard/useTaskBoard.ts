import { useMemo, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { FilterCriteria, Task, TaskStatus } from '../../types'

export function useTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({ searchTerm: '' })
  const [editingTask, setEditingTask] = useState<Task>()

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const { status, searchTerm } = filterCriteria
      const isMatchStatus = status ? task.status === status : true
      const isMatchTerm = task.title.includes(searchTerm) || (task.description || '').includes(searchTerm)

      return isMatchStatus && isMatchTerm
    })
  }, [tasks, filterCriteria.searchTerm, filterCriteria.status])

  const orderedTasks: Record<string, Task[]> = useMemo(() => {
    const tasksByStatusEntries = (Object.values(TaskStatus).map(status => {
      const tasksByStatus = filteredTasks.filter(task => task.status === status)

      return [status, tasksByStatus]
    }))

    return Object.fromEntries(tasksByStatusEntries)
  }, [filteredTasks])

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      if (!task.id) {
        return [...prev, { ...task, id: Date.now() }]
      }
      const newTasks = [...prev]
      const index = newTasks.findIndex(item => item.id === task.id)

      newTasks[index] = { ...prev[index], ...task }

      return newTasks
    })
  }

  const handleDeleteTask = (id: number) => {
    console.log('INTENTIONAL COMMENT FOR FAILED CASES DEMONSTRATION')
    // setTasks(prev => prev.filter(item => item.id !== id))
  }

  const handleChangeFilterCriteria = (filter: Partial<FilterCriteria>) => {
    setFilterCriteria(prev => ({ ...prev, ...filter }))
  }

  const handleEditTask = (task: Task | undefined) => {
    setEditingTask(task)
  }

  const handleDragEnd = (result: DropResult) => {
    const taskId = Number(result.draggableId)
    const { droppableId: oldStatus, index: oldIndex } = result.source
    const { droppableId: newStatus, index: newIndex } = result.destination || {}

    if (newStatus && oldStatus !== newStatus) {
      const newTask = { ...orderedTasks[oldStatus][oldIndex], status: newStatus as TaskStatus }
      const startTasks = orderedTasks[newStatus].slice(0, newIndex)
      const endTasks = orderedTasks[newStatus].slice(newIndex)

      const newOrderedTasks = {
        ...orderedTasks,
        [oldStatus]: orderedTasks[oldStatus].filter(item => item.id !== taskId),
        [newStatus]: startTasks.concat([newTask]).concat(endTasks),
      }

      const newTasks = Object.values(newOrderedTasks).reduce((prev, current) => prev.concat(current), [])

      setTasks(newTasks)
      return
    }

    if (newIndex !== undefined && oldIndex !== newIndex) {
      const newTask = { ...orderedTasks[oldStatus][oldIndex] }
      const oldTasks = orderedTasks[oldStatus].filter(item => item.id !== taskId)
      const startTasks = oldTasks.slice(0, newIndex)
      const endTasks = oldTasks.slice(newIndex)

      const newOrderedTasks = {
        ...orderedTasks,
        [oldStatus]: startTasks.concat([newTask]).concat(endTasks),
      }

      const newTasks = Object.values(newOrderedTasks).reduce((prev, current) => prev.concat(current), [])

      setTasks(newTasks)
      return
    }
  }

  return {
    orderedTasks,
    handleSaveTask,
    handleDeleteTask,
    filterCriteria,
    handleChangeFilterCriteria,
    editingTask,
    handleEditTask,
    handleDragEnd
  }
}
