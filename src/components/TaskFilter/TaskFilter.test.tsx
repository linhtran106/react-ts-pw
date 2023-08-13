import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TaskFilter } from './TaskFilter'

describe('TaskFilter', () => {
  const SELECTOR = {
    STATUS_SELECT: 'status-select',
    SEARCH_INPUT: 'search-input',
    CLEAR_BTN: 'clear-btn',
  }

  const mockFn = jest.fn()

  afterEach(() => {
    mockFn.mockClear()
  })

  it('Status select should work correctly', () => {
    render(<TaskFilter filterCriteria={{ searchTerm: '' }} onChangeFilterCriteria={mockFn} />)

    const statusSelect = screen.getByTestId(SELECTOR.STATUS_SELECT)
    const statusOptions = screen.getAllByRole('option')

    expect(statusOptions.length).toBe(4)

    fireEvent.change(statusSelect, { target: { value: 'Todo' } })

    expect(mockFn).toBeCalledWith({ status: 'Todo' })
  })

  it('Search input should work correctly', () => {
    render(<TaskFilter filterCriteria={{ searchTerm: '' }} onChangeFilterCriteria={mockFn} />)

    const searchInput = screen.getByTestId(SELECTOR.SEARCH_INPUT)
    fireEvent.change(searchInput, { target: { value: 'task 1' } })

    expect(mockFn).toBeCalledWith({ searchTerm: 'task 1' })
  })

  it('Clear button should work correctly', () => {
    render(<TaskFilter filterCriteria={{ searchTerm: 'task 1' }} onChangeFilterCriteria={mockFn} />)

    const clearBtn = screen.getByTestId(SELECTOR.CLEAR_BTN)

    fireEvent.click(clearBtn)

    expect(mockFn).toBeCalledWith({ searchTerm: '' })
  })
})
