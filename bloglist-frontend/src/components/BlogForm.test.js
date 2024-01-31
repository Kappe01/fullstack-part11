import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()

    render(<BlogForm createBlog={createBlog} />)

    const input_title = screen.getByPlaceholderText('write title here')
    const input_author = screen.getByPlaceholderText('write author here')
    const input_url = screen.getByPlaceholderText('write url here')

    const sendButton = screen.getByText('create')

    await userEvent.type(input_title, 'test_title')
    await userEvent.type(input_author, 'test_author')
    await userEvent.type(input_url, 'https://www.testurl.com')

    await userEvent.click(sendButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'test_title',
        author: 'test_author',
        url: 'https://www.testurl.com'
    })
})