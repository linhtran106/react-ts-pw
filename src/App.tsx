import { ChakraProvider, Stack } from '@chakra-ui/react'
import React from 'react'
import { TaskBoard } from './pages/TaskBoard'

function App() {

  return (
    <ChakraProvider>
      <Stack padding="20">
        <TaskBoard />
      </Stack>
    </ChakraProvider>
  )
}

export default App
