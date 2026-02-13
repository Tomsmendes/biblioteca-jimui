
import { Book, Category, User, UserRole, ReadingHistoryItem } from '../types';
import { MOCK_BOOKS, MOCK_CATEGORIES } from '../constants';

const BOOKS_KEY = 'jimui_books';
const CATEGORIES_KEY = 'jimui_categories';
const USERS_KEY = 'jimui_users_list';
const CURRENT_USER_ID_KEY = 'jimui_current_user_id';
const FILE_STORAGE_KEY = 'jimui_file_data_storage'; 

export const db = {
  async init() {
    if (!localStorage.getItem(BOOKS_KEY)) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(MOCK_BOOKS));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(MOCK_CATEGORIES));
    }
    if (!localStorage.getItem(FILE_STORAGE_KEY)) {
      localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(USERS_KEY)) {
      const adminUser: User = {
        id: 'admin_1',
        name: 'Administrador JIMUI',
        email: 'admin@jimui.org',
        password: 'admin',
        role: UserRole.ADMIN,
        favorites: [],
        readingHistory: [],
        cachedBookIds: [],
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
    }
  },

  async getBooks(): Promise<Book[]> {
    const data = localStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveBook(book: Book): Promise<void> {
    const books = await this.getBooks();
    const existingIndex = books.findIndex(b => b.id === book.id);
    if (existingIndex > -1) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  async deleteBook(id: string): Promise<void> {
    const books = await this.getBooks();
    const filtered = books.filter(b => b.id !== id);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(filtered));
    await this.removeFileLocally(id);
  },

  async getCategories(): Promise<Category[]> {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveCategory(name: string): Promise<void> {
    const cats = await this.getCategories();
    cats.push({ id: Date.now().toString(), name });
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  },

  async deleteCategory(id: string): Promise<void> {
    const cats = await this.getCategories();
    const filtered = cats.filter(c => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
  },

  async login(email: string, password?: string): Promise<User | null> {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
      return user;
    }
    return null;
  },

  async register(name: string, email: string, password?: string, role: UserRole = UserRole.USER): Promise<User> {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      favorites: [],
      readingHistory: [],
      cachedBookIds: [],
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);
    return newUser;
  },

  async getCurrentUser(): Promise<User | null> {
    const currentId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!currentId) return null;
    
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    return users.find(u => u.id === currentId) || null;
  },

  async updateUser(updatedUser: User): Promise<void> {
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  },

  // GUARDA O CONTEÚDO NO DISPOSITIVO FISICAMENTE (LocalStorage persistente)
  async saveFileLocally(bookId: string, content: string): Promise<void> {
    const storageRaw = localStorage.getItem(FILE_STORAGE_KEY) || '{}';
    const storage = JSON.parse(storageRaw);
    storage[bookId] = content; 
    
    // Tenta salvar no storage físico do navegador
    try {
      localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(storage));
      
      const user = await this.getCurrentUser();
      if (user && !user.cachedBookIds.includes(bookId)) {
        user.cachedBookIds.push(bookId);
        await this.updateUser(user);
      }
    } catch (e) {
      console.error("Erro ao salvar no dispositivo: Provavelmente falta de espaço.", e);
      alert("Erro ao guardar livro: Espaço no dispositivo insuficiente.");
    }
  },

  // REMOVE O CONTEÚDO DO DISPOSITIVO
  async removeFileLocally(bookId: string): Promise<void> {
    const storage = JSON.parse(localStorage.getItem(FILE_STORAGE_KEY) || '{}');
    delete storage[bookId];
    localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(storage));
    
    const user = await this.getCurrentUser();
    if (user) {
      user.cachedBookIds = user.cachedBookIds.filter(id => id !== bookId);
      await this.updateUser(user);
    }
  },

  async getLocalFile(bookId: string): Promise<string | null> {
    const storage = JSON.parse(localStorage.getItem(FILE_STORAGE_KEY) || '{}');
    return storage[bookId] || null;
  },

  async addToHistory(userId: string, bookId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (user) {
      const historyItem: ReadingHistoryItem = { bookId, readAt: Date.now() };
      const cleanHistory = user.readingHistory.filter(h => h.bookId !== bookId);
      user.readingHistory = [historyItem, ...cleanHistory];
      await this.updateUser(user);
    }
  }
};
