import { Component, inject, OnInit, signal } from '@angular/core'
import { Article } from '../model/article.type'
import { ActivatedRoute } from '@angular/router'
import { ArticleService } from '../services/article.service'

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  private articleService = inject(ArticleService)
  articleItem = signal<Array<Article>>([])

  constructor(private route: ActivatedRoute) {
    this.articleService.selectedPageSlug.set(
      this.route.snapshot.paramMap.get('slug')!
    )
  }

  isLoading = this.articleService.isArticleLoading
  article = this.articleService.article

  ngOnInit(): void {
    this.articleItem.set(this.article())
  }
}
