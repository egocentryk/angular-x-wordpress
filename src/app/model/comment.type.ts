import { Avatars } from './user.type'

export type Comment = {
  author: number
  author_avatar_urls: Avatars
  author_name: string
  author_url: string
  content: {
    rendered: string
  }
  date: string
  date_gmt: string
  id: number
  link: string
  meta: string[]
  parent: number
  post: number
  status: string
  type: string
}
