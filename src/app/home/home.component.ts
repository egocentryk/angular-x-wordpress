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
