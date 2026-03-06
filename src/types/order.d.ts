import { CartItem } from '@/lib/store'
import { ExtendedMenu } from './menu'

export type OrderSchema = {
  cart: CartItem[]
  userId: string
  customerName: string
  email: string
  street: string
  city: string
  phone: string
}

export interface ExtendedCartItemModel {
  id: string
  quantity: number
  menu: ExtendedMenu
}

export interface ExtendedUser {
  id: string
  name: string
  email: string
}

export interface ExtendedOrder {
  id: string
  userId: string
  createdAt: string | Date
  paid: boolean
  cartItems: ExtendedCartItemModel[]
  user: ExtendedUser
}