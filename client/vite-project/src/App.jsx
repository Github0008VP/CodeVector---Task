import './App.css'
import Products from './pages/Products'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>CodeVector</h1>
        <p>Product Catalog</p>
      </header>
      <main className="main">
        <Products />
      </main>
    </div>
  )
}

export default App
