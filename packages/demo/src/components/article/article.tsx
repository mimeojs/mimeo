import { Build, Component, ComponentInterface, h, Prop, State, Watch } from '@stencil/core';
import { ArticleDocument, ArticleFragment, ArticleQuery, ArticleQueryVariables, client } from '../../api';
import { Header } from '../header';

@Component({
  tag: 'mimeo-article',
})
export class MimeoArticle implements ComponentInterface {
  @Prop() slug!: string;
  @State() article?: ArticleFragment;
  @State() error?: string;

  async componentWillLoad() {
    const article = this.load(this.slug);
    if (Build.isServer) {
      await article;
    }
  }

  @Watch('slug') async load(slug: string) {
    // reset state variables
    this.error = undefined;
    this.article = undefined;
    return (
      client
        // query for article
        .query<ArticleQuery, ArticleQueryVariables>({
          query: ArticleDocument,
          variables: {
            slug,
          },
          errorPolicy: 'all',
        })
        // update state
        .then(
          ({ data: { article } }) => (this.article = article),
          ({ message }) => (this.error = message),
        )
    );
  }

  render() {
    const { error, article } = this;
    if (error) {
      return <div class="error">{error}</div>;
    }
    if (article) {
      return [<Header title={article.matter.title} />, <article innerHTML={article.html} />];
    }
    return <span>loading</span>;
  }
}
