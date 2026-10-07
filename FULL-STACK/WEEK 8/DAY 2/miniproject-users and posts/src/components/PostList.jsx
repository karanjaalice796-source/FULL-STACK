import { Component } from 'react'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

export default class PostList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      errorMsg: '',
      isLoading: true,
    }
  }

  componentDidMount() {
    this.loadPosts()
  }

  loadPosts = async () => {
    try {
      const response = await fetch(POSTS_URL)
      if (!response.ok) {
        throw new Error(`The posts request failed (${response.status}).`)
      }

      const posts = await response.json()
      if (!Array.isArray(posts)) {
        throw new Error('The posts response was not a list.')
      }

      this.setState({ posts, isLoading: false })
    } catch (error) {
      this.setState({
        errorMsg: error instanceof Error ? error.message : 'Could not load the posts.',
        isLoading: false,
      })
    }
  }

  render() {
    const { posts, errorMsg, isLoading } = this.state

    return (
      <section className="content-section posts-section" id="posts" aria-labelledby="posts-heading">
        <header className="section-heading">
          <div>
            <p className="kicker"><span /> PART ONE / THE ARCHIVE</p>
            <h2 id="posts-heading">A few good <em>readings</em></h2>
          </div>
          <span className="count-label">{isLoading ? 'FETCHING' : `${posts.length} ENTRIES`}</span>
        </header>

        {isLoading && (
          <div className="loading-note" role="status">
            <span className="loader" /> Turning the pages…
          </div>
        )}
        {errorMsg && (
          <div className="error-note" role="alert">
            <strong>The archive is taking a moment.</strong>
            <span>{errorMsg}</span>
            <button type="button" onClick={this.loadPosts}>Try again</button>
          </div>
        )}
        {!isLoading && !errorMsg && posts.length > 0 && (
          <div className="post-grid">
            {posts.map((post, index) => (
              <article className="post-card" key={post.id}>
                <div className="post-meta">
                  <span>NOTE&nbsp; {String(index + 1).padStart(2, '0')}</span>
                  <span>№ {String(post.id).padStart(3, '0')}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <div className="post-byline">
                  <span>FROM THE COMMONPLACE ARCHIVE</span>
                  <span>↗</span>
                </div>
              </article>
            ))}
          </div>
        )}
        {!isLoading && !errorMsg && posts.length === 0 && (
          <p className="empty-note">No posts came back this time.</p>
        )}
      </section>
    )
  }
}
