import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../Login'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../lib/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders forgot password and register links', () => {
    renderLogin()
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    expect(screen.getByText(/create account/i)).toBeInTheDocument()
  })

  it('renders brand and description', () => {
    renderLogin()
    expect(screen.getByText(/secured by y-qa/i)).toBeInTheDocument()
  })

  it('submits login with email and password', async () => {
    mockLogin.mockResolvedValue()
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('you@company.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••••'), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('you@company.com'), 'bad@example.com')
    await user.type(screen.getByPlaceholderText('••••••••••'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('navigates to home on successful login', async () => {
    mockLogin.mockResolvedValue()
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('you@company.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••••'), 'pass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })
})
