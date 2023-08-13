import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { Badge, Card, CardBody, Divider, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Task, TaskStatus } from '../../types'

const TASK_COLOR = {
  [TaskStatus.Todo]: 'purple',
  [TaskStatus.InProgress]: 'yellow',
  [TaskStatus.Completed]: 'green'
}

const DEFAULT_TASK = {
  title: '',
  status: TaskStatus.Todo,
  description: '',
  id: null,
}

interface Props {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: number) => void
  status: string
}

export const TaskList = (props: Props) => {
  const { tasks, onEditTask, status, onDeleteTask } = props

  return (
    <>
      <Heading size="md">{`${status}${tasks.length ? ` (${tasks.length})` : ''}`}</Heading>

      <IconButton
        variant="outline"
        colorScheme="blue"
        aria-label="Add task"
        icon={<AddIcon />}
        onClick={() => onEditTask({ ...DEFAULT_TASK, status: status as TaskStatus })}
        data-testid="add-btn"
      />

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Stack
            ref={provided.innerRef}
            {...provided.droppableProps}
            bgColor={snapshot.isDraggingOver ? 'gray.50' : 'white'}
            padding="2"
            spacing="4"
            borderRadius="base"
            minHeight="300px"
          >
            {tasks.map((item, index) => (
              <Draggable draggableId={String(item.id)} index={index} key={String(item.id)}>
                {provided => (
                  <Card
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditTask(item)
                    }}
                    cursor="pointer"
                    _hover={{ bgColor: '#ebf8ff' }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    data-testid="task-card"
                  >
                    <CardBody padding="4">
                      <Stack spacing="3">
                        <Flex justifyContent="space-between" alignItems="center">
                          <Heading size="xs" isTruncated>{item.title}</Heading>
                          <IconButton
                            variant='ghost'
                            colorScheme='gray'
                            aria-label='Close'
                            size="xs"
                            onClick={e => {
                              e.stopPropagation()
                              onDeleteTask(item.id!)
                            }}
                            icon={<CloseIcon />}
                            data-testid="delete-btn"
                          />
                        </Flex>
                        <Text fontSize="sm" whiteSpace="pre-line" isTruncated>{item.description}</Text>
                        <Divider />
                        <Stack direction="row" justifyContent="flex-end">
                          <Badge colorScheme={TASK_COLOR[item.status]}>{item.status}</Badge>
                        </Stack>
                      </Stack>
                    </CardBody>
                  </Card>
                )}
              </Draggable>
            ))}
            {!tasks.length && <Text fontSize="sm" align="center">No tasks found.</Text>}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>

    </>
  )
}
