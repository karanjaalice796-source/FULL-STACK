import { connect } from 'react-redux'

function TodoSummary({ remainingCount, completedCount }) {
  return (
    <span>
      {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left
      {completedCount > 0 && ` · ${completedCount} completed`}
    </span>
  )
}

const mapStateToProps = (state) => {
  const completedCount = state.todos.items.filter((todo) => todo.completed).length

  return {
    remainingCount: state.todos.items.length - completedCount,
    completedCount,
  }
}

export default connect(mapStateToProps)(TodoSummary)
