import { Heading, Stack, StackDivider } from '@chakra-ui/react'
import { DragDropContext } from 'react-beautiful-dnd'
import { TaskFilter } from '../../components/TaskFilter'
import { TaskForm } from '../../components/TaskForm'
import { TaskList } from '../../components/TaskList'
import { TaskStatus } from '../../types'
import { useTaskBoard } from './useTaskBoard'

export function TaskBoard() {
  const {
    filterCriteria,
    handleChangeFilterCriteria,
    orderedTasks,
    editingTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask,
    handleDragEnd
  } = useTaskBoard()

  const taskColumns: string[] = Object.values(TaskStatus)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Stack spacing="8">
        <Heading data-cy="page-header">My tasks</Heading>

        <TaskFilter filterCriteria={filterCriteria} onChangeFilterCriteria={handleChangeFilterCriteria} />

        <Stack divider={<StackDivider />} direction="row" spacing="4">
          {taskColumns.map((status) => {
            return (
              <Stack
                key={`column-${status}`}
                width={`${100 / taskColumns.length}%`}
                spacing="4"
                data-testid="task-column"
              >
                <TaskList
                  tasks={orderedTasks[status] || []}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  status={status}
                />
              </Stack>
            )
          })}
        </Stack>

        {editingTask && (
          <TaskForm
            task={editingTask}
            onClose={() => handleEditTask(undefined)}
            onSave={handleSaveTask}
          />
        )}
      </Stack>
    </DragDropContext>
  )
}
