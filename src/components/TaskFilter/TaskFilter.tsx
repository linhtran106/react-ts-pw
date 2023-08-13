import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Select, Stack } from '@chakra-ui/react'
import { FilterCriteria, TaskStatus } from '../../types'

interface Option {
  value?: string
  label: string
}

interface Props {
  filterCriteria: FilterCriteria
  onChangeFilterCriteria: (filter: Partial<FilterCriteria>) => void
}

export function TaskFilter(props: Props) {
  const { filterCriteria, onChangeFilterCriteria } = props

  const statusOptions: Option[] = [
    { label: 'All', value: '' },
    ...Object.values(TaskStatus).map(status => ({ label: status, value: status }))
  ]

  return (
    <Stack justifyContent="space-between" direction="row">
      <Stack direction="row" alignItems="center">
        <FormLabel>Status</FormLabel>
        <Select
          value={filterCriteria.status}
          onChange={e => onChangeFilterCriteria({ status: e.target.value })}
          data-testid="status-select"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </Stack>

      <Stack>
        <InputGroup width="280px">
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='gray.300' />
          </InputLeftElement>
          <Input
            value={filterCriteria.searchTerm}
            onChange={e => onChangeFilterCriteria({ searchTerm: e.target.value })}
            data-testid="search-input"
          />
          {filterCriteria.searchTerm && (
            <InputRightElement onClick={() => onChangeFilterCriteria({ searchTerm: '' })} data-testid="clear-btn">
              <SmallCloseIcon color='gray.300' />
            </InputRightElement>
          )}
        </InputGroup>
      </Stack>
    </Stack>
  )
}
