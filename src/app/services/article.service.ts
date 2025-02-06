import { computed, effect, Injectable, signal } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { environment } from '../../environments/environment.development'
import { Article } from '../model/article.type'
import { Comment } from '../model/comment.type'
import { Tag } from '../model/tag.type'
import { catchError, map, Observable } from 'rxjs'
import { rxResource } from '@angular/core/rxjs-interop'

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

  selectedPageId = signal<number>(1)
  selectedPageSlug = signal<string>('')
  selectedTagsIds = signal<string>('')
  selectedCommentsIds = signal<string>('')

  allArticles = rxResource({
    request: () => this.selectedPageId(),
    loader: ({ request: pageId }) => {
      return this.http
        .get<Article[]>(`${this.articlesApiUrl}?page=${pageId}&per_page=10`)
        .pipe(map((articles) => articles))
    },
  })

  articles = computed(() => this.allArticles.value() ?? ([] as Article[]))

  isArticlesLoading = this.allArticles.isLoading

  loadingEff = effect(() =>
    console.log('loading: ', this.allArticles.isLoading())
  )
  articlesEff = effect(() => console.log('articles: ', this.articles()))

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
        .get<Tag[]>(`${this.tagsApiUrl}${tagsId}`)
        .pipe(map((tags) => tags))
    },
  })

  tags = computed(() => this.allTags.value() ?? ([] as Tag[]))

  tagsEff = effect(() => console.log('tags: ', this.tags()))

  private allComments = rxResource({
    request: () => this.selectedCommentsIds(),
    loader: ({ request: commentsId }) => {
      return this.http
        .get<Comment[]>(`${this.commentsApiUrl}${commentsId}`)
        .pipe(map((tags) => tags))
    },
  })

  comments = computed(() => this.allComments.value() ?? ([] as Comment[]))

  getHeaders(): Observable<HttpResponse<Article[]>> {
    const url: string = `${environment.api.url}${environment.api.paths.posts}?per_page=10`
    return this.http.get<Article[]>(url, {
      observe: 'response',
    })
  }
}
