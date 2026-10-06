import posts from '../data/posts.json'

export default function PostList() {
  return (
    <section className="posts-section" aria-label="Posts from JSON">
      <div className="section-toolbar">
        <span className="section-label">POSTS FROM POSTS.JSON</span>
        <span className="count-pill">{String(posts.length).padStart(2, '0')} ENTRIES</span>
      </div>
      <div className="posts-grid">
        {posts.map((post, index) => (
          <article className="post-card" key={post.id}>
            <div className="post-card-top">
              <span className="post-index">0{index + 1} <i>—</i> NOTE</span>
              <span className="post-date">{post.date}</span>
            </div>
            <h2>{post.title}<span>.</span></h2>
            <p>{post.content}</p>
            <div className="post-card-footer"><code>/{post.slug}</code><span aria-hidden="true">↗</span></div>
          </article>
        ))}
      </div>
      <p className="data-source-note"><span className="source-dot" /> DATA SOURCE <code>src/data/posts.json</code></p>
    </section>
  )
}
