import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders only title', () => {
    const blog = {
        title: 'test',
        author: 'test_author',
        url: 'https://www.testurl.com',
        likes: 0
    }

    const { container } = render(<Blog blog={blog} />)

    const div_hidden = container.querySelector('.blogHidden')
    const div_shown = container.querySelector('.blogShown')

    expect(div_hidden).toHaveTextContent('test')
    expect(div_shown).toHaveStyle('display: none')
})

test('clicking view renders url and likes', async () => {
    const blog = {
        title: 'test',
        author: 'test_author',
        url: 'https://www.testurl.com',
        likes: 13
    }

    const { container } = render(<Blog blog={blog} />)

    const div_hidden = container.querySelector('.blogHidden')
    const div_shown = container.querySelector('.blogShown')

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(div_shown).toHaveTextContent('https://www.testurl.com')
    expect(div_shown).toHaveTextContent('13')
    expect(div_hidden).toHaveStyle('display: none')
    expect(div_shown).not.toHaveStyle('display: none')
})

test('clicking like twice calls event handler twice', async () => {
    const blog = {
        title: 'test',
        author: 'test_author',
        url: 'https://www.testurl.com',
        likes: 5
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} addLike={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})