# Airbotix 编码标准

## 通用编码规范

### 文件命名
- **组件文件**: PascalCase (如 `UserProfile.tsx`)
- **工具文件**: camelCase (如 `formatDate.ts`)
- **常量文件**: UPPER_SNAKE_CASE (如 `API_CONSTANTS.ts`)
- **类型文件**: camelCase (如 `userTypes.ts`)

### 目录结构
- **组件目录**: 按功能分组，每个组件一个文件夹
- **页面目录**: 按路由分组，每个页面一个文件
- **服务目录**: 按模块分组，每个服务一个文件
- **类型目录**: 按实体分组，每个实体一个文件

### 导入顺序
```typescript
// 1. React 相关
import React, { useState, useEffect } from 'react'

// 2. 第三方库
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// 3. 内部组件
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'

// 4. 内部服务
import { userService } from '@/services/userService'

// 5. 类型定义
import type { User, UserRole } from '@/types/user'

// 6. 工具函数
import { formatDate } from '@/utils/formatDate'

// 7. 常量
import { API_ENDPOINTS } from '@/constants/api'
```

## TypeScript 规范

### 类型定义
```typescript
// 接口定义 - 使用 PascalCase
interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// 类型别名 - 使用 PascalCase
type UserRole = 'teacher' | 'admin' | 'super_admin'

// 枚举 - 使用 PascalCase
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// 泛型 - 使用单个大写字母
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

### 函数定义
```typescript
// 函数声明 - 使用 camelCase
function getUserById(id: string): Promise<User> {
  return userService.findById(id)
}

// 箭头函数 - 使用 camelCase
const formatUserName = (user: User): string => {
  return `${user.name} (${user.email})`
}

// 异步函数
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await userService.getAll()
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}
```

### 组件定义
```typescript
// 函数组件 - 使用 PascalCase
interface UserProfileProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.(user)
  }

  return (
    <div className="user-profile">
      {/* 组件内容 */}
    </div>
  )
}

export default UserProfile
```

## React 规范

### 组件结构
```typescript
// 1. 导入语句
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

// 2. 类型定义
interface ComponentProps {
  // props 定义
}

// 3. 组件定义
const Component: React.FC<ComponentProps> = (props) => {
  // 4. Hooks 调用
  const [state, setState] = useState(initialValue)
  
  // 5. 事件处理函数
  const handleClick = () => {
    // 处理逻辑
  }
  
  // 6. 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [])
  
  // 7. 渲染逻辑
  return (
    <div>
      {/* JSX 内容 */}
    </div>
  )
}

// 8. 导出
export default Component
```

### Hooks 使用
```typescript
// 自定义 Hook - 使用 use 前缀
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await userService.findById(userId)
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, loading, error }
}
```

### 状态管理
```typescript
// Context 定义
interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Context Provider
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  
  const isAuthenticated = user !== null

  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  )
}

// Context Hook
const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
```

## 样式规范

### TailwindCSS 使用
```tsx
// 基础样式
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// 响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 状态样式
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">

// 条件样式
<div className={`p-4 rounded ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
```

### 自定义样式
```css
/* 使用 CSS 变量 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --error-color: #ef4444;
}

/* 自定义组件样式 */
.custom-button {
  @apply px-4 py-2 rounded font-medium transition-colors;
  @apply bg-blue-500 text-white hover:bg-blue-600;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}
```

## API 规范

### 请求格式
```typescript
// API 服务定义
class UserService {
  private baseURL = process.env.REACT_APP_API_URL

  async getUsers(params?: GetUsersParams): Promise<ApiResponse<User[]>> {
    const response = await axios.get(`${this.baseURL}/users`, { params })
    return response.data
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await axios.post(`${this.baseURL}/users`, userData)
    return response.data
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await axios.put(`${this.baseURL}/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await axios.delete(`${this.baseURL}/users/${id}`)
    return response.data
  }
}
```

### 错误处理
```typescript
// 统一错误处理
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }
  return 'An unexpected error occurred'
}

// 在组件中使用
const [error, setError] = useState<string | null>(null)

const fetchData = async () => {
  try {
    setError(null)
    const data = await userService.getUsers()
    setUsers(data.data)
  } catch (err) {
    setError(handleApiError(err))
  }
}
```

## 测试规范

### 单元测试
```typescript
// 组件测试
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'teacher',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
    
    fireEvent.click(screen.getByText('Edit'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser)
  })
})
```

### 集成测试
```typescript
// API 测试
import { userService } from './userService'

describe('UserService', () => {
  it('fetches users successfully', async () => {
    const users = await userService.getUsers()
    expect(users.success).toBe(true)
    expect(Array.isArray(users.data)).toBe(true)
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('API Error'))
    
    await expect(userService.getUsers()).rejects.toThrow('API Error')
  })
})
```

## 文档规范

### 组件文档
```typescript
/**
 * 用户资料组件
 * 
 * @param user - 用户信息
 * @param onEdit - 编辑回调函数
 * @param onDelete - 删除回调函数
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   user={user} 
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
interface UserProfileProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
}
```

### 函数文档
```typescript
/**
 * 格式化用户姓名
 * 
 * @param user - 用户对象
 * @returns 格式化后的用户姓名字符串
 * 
 * @example
 * ```typescript
 * const formattedName = formatUserName({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 * // 返回: "John Doe (john@example.com)"
 * ```
 */
const formatUserName = (user: User): string => {
  return `${user.name} (${user.email})`
}
```

## 性能优化规范

### 组件优化
```typescript
// 使用 React.memo 优化重渲染
const UserProfile = React.memo<UserProfileProps>(({ user, onEdit }) => {
  // 组件逻辑
})

// 使用 useMemo 优化计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// 使用 useCallback 优化函数
const handleClick = useCallback(() => {
  onEdit?.(user)
}, [user, onEdit])
```

### 代码分割
```typescript
// 路由懒加载
const UserProfile = lazy(() => import('./UserProfile'))

// 组件懒加载
const LazyComponent = lazy(() => import('./LazyComponent'))
```

---

**维护团队**: Airbotix 开发团队  
**最后更新**: 2025-01-15
