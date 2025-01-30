import { Component, inject, OnInit, signal } from '@angular/core'
import { ArticlesService } from '../services/articles.service'
import { Article } from '../model/article.type'
import { catchError } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticlesService)
  articleItem = signal<Array<Article>>([])

  slug: string | null = ''

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')

    this.articleService
      .getArticleFromApi(this.slug)
      .pipe(
        catchError((err) => {
          console.log(err)
          throw err
        })
      )
      .subscribe((article) => {
        this.articleItem.set(article)
      })
  }
}
