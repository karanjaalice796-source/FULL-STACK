import { Component } from 'react'
import data from '../data/data.json'

export default class Example1 extends Component {
  render() {
    return (
      <div className="example-content">
        <div className="example-heading"><span className="example-number">01</span><div><span className="section-label">EXAMPLE 1</span><h2>Social <em>links</em></h2></div><span className="example-count">0{data.SocialMedias.length}</span></div>
        <p className="example-description">A simple string array, mapped to friendly outbound links.</p>
        <div className="social-list">
          {data.SocialMedias.map((url, index) => {
            const network = new URL(url).hostname.replace(/^www\./, '')
            return (
              <a className="social-link" href={url} target="_blank" rel="noreferrer" key={url}>
                <span className="social-index">0{index + 1}</span>
                <span>{network}</span>
                <span className="social-arrow" aria-hidden="true">↗</span>
              </a>
            )
          })}
        </div>
      </div>
    )
  }
}
