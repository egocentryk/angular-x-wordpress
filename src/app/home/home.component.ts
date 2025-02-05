import { Component, OnInit } from '@angular/core'
import { ArticleService } from '../services/article.service'
import { Observable, from, lastValueFrom } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Article } from '../model/article.type'
import { AsyncPipe, DatePipe } from '@angular/common'
import { TruncatePipe } from '../pipes/truncate.pipe'

type ArticleItem = Article & {
  tag_names: string[]
  comments: string[]
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [AsyncPipe, DatePipe, TruncatePipe, RouterLink],
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  pageCount: number = 0
  mergedArray$: Observable<ArticleItem[]>

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute
  ) {
    this.mergedArray$ = this.route.params.pipe(
      switchMap((params) => {
        if (!params['page']) {
          params = {
            page: 1,
          }

          // return of([])
        }

        return from(this.getArticlesFromApi(+params['page']))
      })
    )
  }

  async getArticlesFromApi(page: number): Promise<ArticleItem[]> {
    const articles$ = this.articleService.getArticles(page)
    const articles = await lastValueFrom(articles$)

    const tagIDs = articles.map((article) => article.tags).join(',')
    const tags$ = this.articleService.getTags(tagIDs)
    const tags = await lastValueFrom(tags$)

    const articleIDs = articles.map((article) => article.id).join(',')
    const comments$ = this.articleService.getComments(articleIDs)
    const comments = await lastValueFrom(comments$)

    const result = articles.map((article) => {
      const relatedTags = article.tags
        .map((tag_ID) => tags.find((tag) => tag.id == tag_ID)?.name!)
        .filter((exists) => !!exists)

      const relatedComments = comments.filter(
        (comment) => comment.post === article.id
      )

      return {
        ...article,
        tag_names: relatedTags,
        comments: relatedComments as unknown as string[],
      }
    })

    return result
  }

  getPagesCount() {
    this.articleService.getHeaders().subscribe((articles) => {
      this.pageCount = +articles.headers.get('X-WP-TotalPages')!
    })
  }

  goToPage(page: number) {}

  ngOnInit(): void {
    this.getPagesCount()
  }
}
