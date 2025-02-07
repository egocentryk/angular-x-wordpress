import { computed, effect, Injectable, signal } from '@angular/core'
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http'
import { environment } from '../../environments/environment.development'
import { Article } from '../model/article.type'
import { Comment } from '../model/comment.type'
import { Tag } from '../model/tag.type'
import { catchError, map, Observable } from 'rxjs'
import { rxResource } from '@angular/core/rxjs-interop'
import { setErrorMessage } from '../core/helpers/error-message'
import { Category } from '../model/category.type'

type ArticleItem = Article & {
  tag_names: string[]
  comments: Comment[]
  category_names: Category[]
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  private articlesApiUrl: string =
    environment.api.url + environment.api.paths.posts

  private tagsApiUrl: string = environment.api.url + environment.api.paths.tags

  private commentsApiUrl: string =
    environment.api.url + environment.api.paths.comments

  private categoriesApiUrl: string =
    environment.api.url + environment.api.paths.categories

  selectedPageId = signal<number>(1)
  selectedPageSlug = signal<string>('')
  selectedCategoryIds = signal<string>('')
  selectedCommentsIds = signal<string>('')
  selectedTagsIds = signal<string>('')
  selectedArticleId = signal<number | null>(null)

  articlesList = signal<Article[]>([])

  allArticles = rxResource({
    request: () => this.selectedPageId(),
    loader: ({ request: pageId }) => {
      return this.http
        .get<Article[]>(`${this.articlesApiUrl}?page=${pageId}&per_page=10`)
        .pipe(map((articles) => articles))
    },
  })

  articleId = computed(() =>
    this.allArticles.value()?.map((article) => article.id)
  )

  tagsId = computed(
    () =>
      this.allArticles
        .value()
        ?.map((article) => article.tags)
        .join(',') ?? ''
  )

  tagsIdEff = effect(() => console.log('tagsId: ', this.tagsId()))

  commentsId = computed(
    () =>
      this.allArticles
        .value()
        ?.map((article) => article.id)
        .join(',') ?? ''
  )

  categoryId = computed(() =>
    this.allArticles.value()?.map((article) => article.categories)
  )

  categoryEff = effect(() => console.log('category: ', this.categoryId()))

  private singleArticle = rxResource({
    request: () => this.selectedPageSlug(),
    loader: ({ request: slug }) => {
      return this.http
        .get<Article[]>(`${this.articlesApiUrl}?slug=${slug}`)
        .pipe(
          catchError((err) => {
            console.log(err)
            throw err
          }),
          map((articles) => articles)
        )
    },
  })

  article = computed(() => this.singleArticle.value() ?? ([] as Article[]))

  isArticleLoading = this.singleArticle.isLoading

  private allTags = rxResource({
    request: () => this.selectedTagsIds(),
    loader: ({ request: tagsId }) => {
      return this.http
        .get<Tag[]>(`${this.tagsApiUrl}${tagsId}&per_page=100`)
        .pipe(map((tags) => tags))
    },
  })

  tags = computed(() => this.allTags.value() ?? ([] as Tag[]))

  private allComments = rxResource({
    request: () => this.selectedCommentsIds(),
    loader: ({ request: commentsId }) => {
      return this.http.get<Comment[]>(`${this.commentsApiUrl}${commentsId}`)
    },
  })

  comments = computed(() => this.allComments.value() ?? ([] as Comment[]))

  private allCategories = rxResource({
    request: () => this.selectedCategoryIds(),
    loader: ({ request: categoryId }) => {
      return this.http.get<Category[]>(`${this.categoriesApiUrl}${categoryId}`)
    },
  })

  categories = computed(() => this.allCategories.value() ?? ([] as Category[]))

  getHeaders(): Observable<HttpResponse<Article[]>> {
    const url: string = `${environment.api.url}${environment.api.paths.posts}?per_page=10`
    return this.http.get<Article[]>(url, {
      observe: 'response',
    })
  }

  articles = computed(
    () =>
      this.allArticles.value()?.map((article) => {
        const relatedTags = article.tags
          .map((tag_ID) => this.tags().find((tag) => tag.id == tag_ID)?.name!)
          .filter((exists) => !!exists)

        const relatedComments = this.comments().filter(
          (comment) => comment.post === article.id
        )

        const relatedCategories = this.categories().filter(
          (category) => category.id === article.categories[0]
        )

        return {
          ...article,
          tag_names: relatedTags,
          comments: relatedComments,
          category_names: relatedCategories,
        }
      }) ?? ([] as ArticleItem[])
  )

  articlesError = computed(() => this.allArticles.error() as HttpErrorResponse)
  articlesErrorMessage = computed(() =>
    setErrorMessage(this.articlesError(), 'Article')
  )
  articleErrorStatus = computed(() => this.articlesError().status)

  isArticlesLoading = this.allArticles.isLoading

  loadingEff = effect(() =>
    console.log('loading: ', this.allArticles.isLoading())
  )
  articlesEff = effect(() => console.log('articles: ', this.articles()))
}
