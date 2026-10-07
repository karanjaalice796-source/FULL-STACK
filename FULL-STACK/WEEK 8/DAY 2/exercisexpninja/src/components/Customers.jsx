import { Component } from 'react'

export default class Customers extends Component {
  state = { customers: [], loading: true, error: null }

  componentDidMount() {
    this.fetchCustomers()
  }

  fetchCustomers = async () => {
    this.setState({ loading: true, error: null })

    try {
      const response = await fetch('/api/customers/')
      if (!response.ok) {
        throw new Error(`Customers request failed (${response.status} ${response.statusText})`)
      }

      const customers = await response.json()
      if (!Array.isArray(customers)) {
        throw new Error('The customers response was not a JSON array.')
      }

      this.setState({ customers, loading: false })
    } catch (error) {
      this.setState({ error: error.message || 'Could not load customers.', loading: false })
    }
  }

  render() {
    const { customers, loading, error } = this.state

    if (loading) {
      return <p className="request-state"><span className="loader" /> Gathering the customer list…</p>
    }

    if (error) {
      return (
        <div className="request-error" role="alert">
          <p>{error}</p>
          <button className="retry-button" onClick={this.fetchCustomers}>Try again</button>
        </div>
      )
    }

    return (
      <div className="customer-grid" aria-label="Customers returned by Express">
        {customers.map((customer, index) => (
          <article className="customer-card" key={customer.id}>
            <span className="customer-number">0{index + 1} <i>·</i> CUSTOMER</span>
            <h3>{customer.firstName}<br /><em>{customer.lastName}</em></h3>
            <span className="customer-id">ID {String(customer.id).padStart(2, '0')}</span>
          </article>
        ))}
        {customers.length === 0 && <p className="empty-state">The server returned an empty list.</p>}
      </div>
    )
  }
}
