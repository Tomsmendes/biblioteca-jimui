import { firestore } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where
} from "firebase/firestore";

import { Book, Category, User, UserRole, ReadingHistoryItem } from "../types";

export const db = {

  async init() {
    // Nada necessário aqui — Firestore já inicializa sozinho
  },

  // ---------------- LIVROS ----------------

  async getBooks(): Promise<Book[]> {
    const snapshot = await getDocs(collection(firestore, "books"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
  },

  async saveBook(book: Book): Promise<void> {
    if (book.id) {
      const ref = doc(firestore, "books", book.id);
      await updateDoc(ref, { ...book });
    } else {
      await addDoc(collection(firestore, "books"), book);
    }
  },

  async deleteBook(id: string): Promise<void> {
    await deleteDoc(doc(firestore, "books", id));
  },

  // ---------------- CATEGORIAS ----------------

  async getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(collection(firestore, "categories"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  async saveCategory(name: string): Promise<void> {
    await addDoc(collection(firestore, "categories"), { name });
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(firestore, "categories", id));
  },

  // ---------------- USUÁRIOS ----------------

  async register(
    name: string,
    email: string,
    password?: string,
    role: UserRole = UserRole.USER
  ): Promise<User> {

    const newUser: User = {
      id: "",
      name,
      email,
      password,
      role,
      favorites: [],
      readingHistory: [],
      cachedBookIds: [],
    };

    const docRef = await addDoc(collection(firestore, "users"), newUser);

    await updateDoc(docRef, { id: docRef.id });

    return { ...newUser, id: docRef.id };
  },

  async login(email: string, password?: string): Promise<User | null> {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", email),
      where("password", "==", password)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].data() as User;
    }

    return null;
  },

  async getCurrentUser(): Promise<User | null> {
    return null; // Agora controlaremos via estado (melhor prática)
  },

  async updateUser(updatedUser: User): Promise<void> {
    const ref = doc(firestore, "users", updatedUser.id);
    await updateDoc(ref, { ...updatedUser });
  },

  async logout(): Promise<void> {
    return;
  },

  // ---------------- HISTÓRICO ----------------

  async addToHistory(userId: string, bookId: string): Promise<void> {
    const ref = doc(firestore, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return;

    const user = snapshot.data() as User;

    const historyItem: ReadingHistoryItem = {
      bookId,
      readAt: Date.now()
    };

    const cleanHistory = user.readingHistory?.filter(h => h.bookId !== bookId) || [];

    await updateDoc(ref, {
      readingHistory: [historyItem, ...cleanHistory]
    });
  }
};
