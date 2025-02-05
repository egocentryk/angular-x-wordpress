import { Component, inject, OnInit } from '@angular/core'
import { ArticleService } from '../services/article.service'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Article } from '../model/article.type'
import { Comment } from '../model/comment.type'
import { AsyncPipe, DatePipe } from '@angular/common'
import { TruncatePipe } from '../pipes/truncate.pipe'
import { from, Observable, switchMap } from 'rxjs'

type ArticleItem = Article & {
  tag_names: string[]
  comments: Comment[]
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

  private articleService = inject(ArticleService)

  constructor(private route: ActivatedRoute) {
    this.mergedArray$ = this.route.params.pipe(
      switchMap((params) => {
        if (!params['page']) {
          params = {
            page: 1,
          }

          // return of([])
        }

        this.articleService.selectedPageId.set(+params['page'])

        return from([this.getArticles()])
      })
    )
  }

  isLoading = this.articleService.isArticlesLoading

  getArticles = (): ArticleItem[] => {
    const articles = this.articleService.articles

    const tagIDs = articles()
      .map((article) => article.tags)
      .join(',')

    this.articleService.selectedTagsIds.set(tagIDs)

    const tags = this.articleService.tags

    const articleIDs = articles()
      .map((article) => article.id)
      .join(',')

    this.articleService.selectedCommentsIds.set(articleIDs)

    const comments = this.articleService.comments

    const result = articles().map((article) => {
      const relatedTags = article.tags
        .map((tag_ID) => tags().find((tag) => tag.id == tag_ID)?.name!)
        .filter((exists) => !!exists)

      const relatedComments = comments().filter(
        (comment) => comment.post === article.id
      )

      return {
        ...article,
        tag_names: relatedTags,
        comments: relatedComments,
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
