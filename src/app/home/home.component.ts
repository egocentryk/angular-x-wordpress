import { Component, inject, OnInit } from '@angular/core'
import { ArticleService } from '../services/article.service'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { DatePipe } from '@angular/common'
import { TruncatePipe } from '../pipes/truncate.pipe'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [DatePipe, TruncatePipe, RouterLink],
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  pageCount: number = 0

  private articleService = inject(ArticleService)

  constructor(private route: ActivatedRoute) {
    this.articleService.selectedPageId.set(
      +this.route.snapshot.paramMap.get('page')! || 1
    )
  }

  isLoading = this.articleService.isArticlesLoading
  errorMessage = this.articleService.articlesErrorMessage

  articles = this.articleService.articles

  // getArticles = (): ArticleItem[] => {
  //   const articles = this.articleService.articles

  //   const tagIDs = articles()
  //     .map((article) => article.tags)
  //     .join(',')

  //   this.articleService.selectedTagsIds.set(tagIDs)

  //   const tags = this.articleService.tags

  //   const articleIDs = articles()
  //     .map((article) => article.id)
  //     .join(',')

  //   this.articleService.selectedCommentsIds.set(articleIDs)

  //   const comments = this.articleService.comments

  //   const result = articles().map((article) => {
  //     const relatedTags = article.tags
  //       .map((tag_ID) => tags().find((tag) => tag.id == tag_ID)?.name!)
  //       .filter((exists) => !!exists)

  //     const relatedComments = comments().filter(
  //       (comment) => comment.post === article.id
  //     )

  //     return {
  //       ...article,
  //       tag_names: relatedTags,
  //       comments: relatedComments,
  //     }
  //   })

  //   return result
  // }

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
