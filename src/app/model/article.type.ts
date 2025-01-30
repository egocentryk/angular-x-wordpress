export type Article = {
  id: number
  slug: string
  status: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  author: number
  categories: string[]
  tags: string[]
}
