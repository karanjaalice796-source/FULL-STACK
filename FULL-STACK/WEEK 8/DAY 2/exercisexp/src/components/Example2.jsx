import { Component } from 'react'
import data from '../data/data.json'

export default class Example2 extends Component {
  render() {
    return (
      <div className="example-content">
        <div className="example-heading"><span className="example-number">02</span><div><span className="section-label">EXAMPLE 2</span><h2>Skill <em>set</em></h2></div><span className="example-count">0{data.Skills.length}</span></div>
        <p className="example-description">Nested skill arrays, grouped by area. Hot skills get a little spark.</p>
        <div className="skills-list">
          {data.Skills.map((group) => (
            <div className="skill-group" key={group.Area}>
              <h3>{group.Area}</h3>
              <div className="skill-tags">
                {group.SkillSet.map((skill) => (
                  <span className={`skill-tag${skill.Hot ? ' skill-hot' : ''}`} key={skill.Name}>
                    {skill.Hot && <span aria-label="featured skill">✳ </span>}{skill.Name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
