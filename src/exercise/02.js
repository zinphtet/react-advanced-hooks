// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "data" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "data" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useAsync = (asyncCallback, initialState) => {
  const [state, unSafedispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const mountRef = React.useRef(false)

  React.useEffect(() => {
    mountRef.current = true
    return () => (mountRef.current = false)
  }, [])

  const dispatch = React.useCallback((...args) => {
    if (mountRef.current) {
      unSafedispatch(...args)
    }
  }, [])
  React.useEffect(() => {
    const promise = asyncCallback()
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      pokemon => {
        dispatch({type: 'resolved', data: pokemon})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [asyncCallback])

  return state
}

function PokemonInfo({pokemonName}) {
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) return
    return fetchPokemon(pokemonName)
  }, [pokemonName])
  const state = useAsync(asyncCallback, {
    status: pokemonName ? 'pending' : 'idle',
  })
  const {data, status, error} = state

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
