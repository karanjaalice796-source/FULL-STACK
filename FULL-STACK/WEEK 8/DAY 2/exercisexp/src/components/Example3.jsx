import { Component } from 'react'
import data from '../data/data.json'

export default class Example3 extends Component {
  render() {
    return (
      <div className="example-content">
        <div className="example-heading"><span className="example-number">03</span><div><span className="section-label">EXAMPLE 3</span><h2>Experience <em>log</em></h2></div><span className="example-count">0{data.Experiences.length}</span></div>
        <p className="example-description">Companies contain roles; roles contain details. Every mapped item has a key.</p>
        <div className="experience-list">
          {data.Experiences.map((experience) => (
            <div className="experience-card" key={experience.companyName}>
              <div className="experience-company">
                <span className="company-monogram" aria-hidden="true">{experience.companyName.slice(0, 1)}</span>
                <a href={experience.url} target="_blank" rel="noreferrer">{experience.companyName}<span aria-hidden="true"> ↗</span></a>
              </div>
              {experience.roles.map((role) => (
                <div className="role-card" key={`${experience.companyName}-${role.title}`}>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <div className="role-meta"><span>{role.startDate} — {role.endDate}</span><span>{role.location}</span></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
