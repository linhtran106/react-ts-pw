import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea
} from '@chakra-ui/react'
import { useState } from 'react'
import { STATUS_OPTIONS, Task, TaskStatus } from '../../types'

interface Props {
  task: Task
  onClose: () => void
  onSave: (task: Task) => void
}

export function TaskForm(props: Props) {
  const { task, onClose, onSave } = props
  const [editValue, setEditingValue] = useState<Task>(task)

  const [isDirty, setIsDirty] = useState<boolean>(false)

  const titleError = !editValue.title ? 'Title is required.' : ''

  const handeInputChange = (value: Partial<Task>) => {
    setEditingValue({ ...editValue, ...value })
  }

  const handleSave = () => {
    setIsDirty(true)
    if (titleError) {
      return
    }
    onSave(editValue)
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{!task.id ? 'New task' : 'Edit task'}</ModalHeader>

        <ModalBody>
          <form onSubmit={handleSave}>
            <Stack spacing="4">
              <FormControl isInvalid={isDirty && !!titleError}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editValue.title}
                  onChange={e => handeInputChange({ title: e.target.value })}
                />
                {isDirty && titleError && <FormErrorMessage>{titleError}</FormErrorMessage>}
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editValue.description}
                  onChange={e => handeInputChange({ description: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editValue.status}
                  onChange={e => handeInputChange({ status: e.target.value as TaskStatus })}
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Stack justifyContent="flex-end">
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" colorScheme="teal" onClick={handleSave}>Save</Button>
            </ButtonGroup>
          </Stack>
        </ModalFooter>

      </ModalContent>
    </Modal>
  )
}
