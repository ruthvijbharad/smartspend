export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          amount: number
          month: string
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          month: string
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          month?: string
          year?: number
          created_at?: string
        }
      }
      savings: {
        Row: {
          id: string
          user_id: string
          amount: number
          target: number
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          target: number
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          target?: number
          title?: string
          created_at?: string
        }
      }
    }
  }
}