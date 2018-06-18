import ExternalLinkTask from './actions/external-link-task'

const BASE_URL = 'https://iodide-project.github.io/iodide-examples'

export const iodideExamples = [
  {
    title: 'What a Web Notebook Looks Like',
    url: `${BASE_URL}/what-a-web-notebook-looks-like.html`,
  },
  {
    title: 'Evictions Notices by SF Neighborhood, 1995-2015',
    url: `${BASE_URL}/eviction-notices-by-sf-neighborhood--1999-2015.html`,
  },
  {
    title: 'Output Handling',
    url: `${BASE_URL}/output-handling.html`,
  },
]

export default iodideExamples.map(e => new ExternalLinkTask({ title: e.title, url: e.url }))
