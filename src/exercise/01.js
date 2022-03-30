// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const countReducer = (state, action) => {
  switch (action.type) {
    case 'INCRE':
      return {
        ...state,
        count: state.count + action.payload,
      }

    default:
      return {
        ...state,
      }
  }
  // return {
  // ...count,
  // count: count.count + step,
  // }
}

function Counter() {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)
  const [state, dispatch] = React.useReducer(countReducer, {count: 0})

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to changeCount
  const increment = () => dispatch({type: 'INCRE', payload: 10})
  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
