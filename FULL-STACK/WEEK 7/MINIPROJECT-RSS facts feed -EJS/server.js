import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import Parser from 'rss-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDirectory = path.join(__dirname, 'public')
const parser = new Parser()
const app = express()
const port = Number(process.env.PORT) || 3002
const feedUrl = 'https://thefactfile.org/feed/'
const cacheDuration = 5 * 60 * 1000

let cachedPosts = []
let cacheExpiresAt = 0

app.set('view engine', 'ejs')
app.set('views', path.join(publicDirectory, 'pages'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(publicDirectory))

function getCategories(posts) {
  return [...new Set(posts.flatMap((post) => post.categories))].sort((a, b) =>
    a.localeCompare(b),
  )
}

function normalizePost(item) {
  const categories = Array.isArray(item.categories)
    ? item.categories.filter((category) => typeof category === 'string' && category.trim())
    : typeof item.category === 'string' && item.category.trim()
      ? [item.category.trim()]
      : []
  const rawDate = item.isoDate || item.pubDate
  const parsedDate = rawDate ? new Date(rawDate) : null

  return {
    title: item.title?.trim() || 'Untitled fact',
    link: item.link || 'https://thefactfile.org/',
    date: parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Date not provided',
    creator: item.creator || item.author || item['dc:creator'] || 'The Fact File',
    categories,
    content: item.contentSnippet || item.summary || item.content || item.description || 'No summary provided.',
  }
}

async function getPosts() {
  if (cachedPosts.length && Date.now() < cacheExpiresAt) {
    return cachedPosts
  }

  const { data: xml } = await axios.get(feedUrl, {
    timeout: 15000,
    responseType: 'text',
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  })
  const feed = await parser.parseString(xml)
  cachedPosts = feed.items.map(normalizePost)
  cacheExpiresAt = Date.now() + cacheDuration
  return cachedPosts
}

function renderSearch(response, { posts = [], selectedTitle = '', selectedCategory = '', error = '' } = {}) {
  response.render('search', {
    posts,
    categories: getCategories(cachedPosts),
    titles: cachedPosts.map((post) => post.title),
    selectedTitle,
    selectedCategory,
    error,
  })
}

app.get('/', async (_request, response) => {
  try {
    const posts = await getPosts()
    response.render('index', { posts, error: '' })
  } catch (error) {
    console.error('Could not load RSS feed:', error)
    response.status(502).render('index', {
      posts: [],
      error: 'The facts feed could not be reached just now. Please try again in a little while.',
    })
  }
})

app.get('/search', async (_request, response) => {
  try {
    await getPosts()
    renderSearch(response)
  } catch (error) {
    console.error('Could not load RSS feed for search:', error)
    response.status(502).render('search', {
      posts: [],
      categories: getCategories(cachedPosts),
      titles: cachedPosts.map((post) => post.title),
      selectedTitle: '',
      selectedCategory: '',
      error: 'Search options are unavailable because the facts feed could not be reached.',
    })
  }
})

app.post('/search/title', async (request, response) => {
  const selectedTitle = typeof request.body.title === 'string' ? request.body.title.trim() : ''

  try {
    const posts = await getPosts()
    const matches = selectedTitle
      ? posts.filter((post) => post.title.toLocaleLowerCase().includes(selectedTitle.toLocaleLowerCase()))
      : []
    renderSearch(response, {
      posts: matches,
      selectedTitle,
      error: selectedTitle ? '' : 'Choose a title to search for.',
    })
  } catch (error) {
    console.error('Could not search RSS feed by title:', error)
    response.status(502).render('search', {
      posts: [],
      categories: getCategories(cachedPosts),
      titles: cachedPosts.map((post) => post.title),
      selectedTitle,
      selectedCategory: '',
      error: 'The facts feed could not be reached, so the title search could not be completed.',
    })
  }
})

app.post('/search/category', async (request, response) => {
  const selectedCategory = typeof request.body.category === 'string' ? request.body.category.trim() : ''

  try {
    const posts = await getPosts()
    const matches = selectedCategory
      ? posts.filter((post) => post.categories.some(
        (category) => category.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase(),
      ))
      : []
    renderSearch(response, {
      posts: matches,
      selectedCategory,
      error: selectedCategory ? '' : 'Choose a category to search for.',
    })
  } catch (error) {
    console.error('Could not search RSS feed by category:', error)
    response.status(502).render('search', {
      posts: [],
      categories: getCategories(cachedPosts),
      titles: cachedPosts.map((post) => post.title),
      selectedTitle: '',
      selectedCategory,
      error: 'The facts feed could not be reached, so the category search could not be completed.',
    })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`RSS facts reader listening on http://localhost:${port}`)
})
