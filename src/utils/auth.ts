import type { User } from '../types';

const AUTH_STORAGE_KEY = 'gas-auth-user';
const USERS_STORAGE_KEY = 'gas-users';

// Usuários padrão do sistema (você pode adicionar mais via interface depois)
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'admin@sistema.com',
    password: 'admin123', // Em produção, usar hash
    name: 'Administrador',
    companyName: 'Sistema de Leitura de Gás',
    plan: 'enterprise',
    maxUnits: 999,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'demo@sistema.com',
    password: 'demo123',
    name: 'Usuário Demo',
    companyName: 'Empresa Demo',
    plan: 'free',
    maxUnits: 3,
    createdAt: new Date().toISOString()
  }
];

// Inicializa usuários padrão se não existirem
const initializeUsers = (): void => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

// Carrega todos os usuários
export const loadUsers = (): User[] => {
  try {
    initializeUsers();
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return DEFAULT_USERS;
  }
};

// Salva usuários
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Login
export const login = (email: string, password: string): User | null => {
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Salva usuário logado (sem senha)
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// Verifica se está autenticado
export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    return null;
  }
};

// Registra novo usuário
export const register = (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
  try {
    const users = loadUsers();
    
    // Verifica se email já existe
    if (users.some(u => u.email === userData.email)) {
      return null;
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Faz login automático
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return null;
  }
};

// Atualiza dados do usuário
export const updateUser = (userId: string, updates: Partial<User>): boolean => {
  try {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return false;
    
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    
    // Atualiza usuário logado se for o mesmo
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...users[index] };
      delete (updatedUser as any).password;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
};

// Deleta usuário
export const deleteUser = (userId: string): boolean => {
  try {
    const users = loadUsers();
    const filtered = users.filter(u => u.id !== userId);
    
    if (filtered.length === users.length) return false;
    
    saveUsers(filtered);
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return false;
  }
};

// Altera senha
export const changePassword = (userId: string, oldPassword: string, newPassword: string): boolean => {
  try {
    const users = loadUsers();
    const user = users.find(u => u.id === userId && u.password === oldPassword);
    
    if (!user) return false;
    
    user.password = newPassword;
    saveUsers(users);
    return true;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return false;
  }
};