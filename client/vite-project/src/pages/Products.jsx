import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  // Filter state
  const [limit, setLimit] = useState(12)
  const [category, setCategory] = useState('')
  const [currentCursor, setCurrentCursor] = useState(null)
  const [customUrl, setCustomUrl] = useState('')

  const fetchProducts = async (cursor = null) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append('limit', limit)
      
      if (category.trim()) {
        params.append('category', category.trim())
      }
      
      if (cursor) {
        params.append('cursor', cursor)
      }
      
      const url = `/api/products?${params.toString()}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
        setNextCursor(data.nextCursor)
        setHasMore(!!data.nextCursor)
        setCurrentCursor(cursor || null)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError(err.message || 'Error fetching products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = () => {
    setCurrentCursor(null)
    fetchProducts(null)
  }

  const handleCustomUrlFetch = async () => {
    if (!customUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Extract the path and query from the URL
      let urlToFetch = customUrl.trim()
      
      // If it's a full URL, extract just the path and query
      if (urlToFetch.startsWith('http://') || urlToFetch.startsWith('https://')) {
        const url = new URL(urlToFetch)
        urlToFetch = url.pathname + url.search
      }
      
      const response = await fetch(urlToFetch)
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
        setNextCursor(data.nextCursor)
        setHasMore(!!data.nextCursor)
        setCurrentCursor(null)
      } else {
        setError('Invalid response: No success flag')
      }
    } catch (err) {
      setError(err.message || 'Error fetching from custom URL')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchProducts(nextCursor)
    }
  }

  const handleReset = () => {
    setLimit(12)
    setCategory('')
    setCurrentCursor(null)
    setProducts([])
    setNextCursor(null)
    setHasMore(false)
    // Fetch with default values
    setTimeout(() => {
      const params = new URLSearchParams()
      params.append('limit', 12)
      const url = `/api/products?${params.toString()}`
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProducts(data.products || [])
            setNextCursor(data.nextCursor)
            setHasMore(!!data.nextCursor)
          }
        })
        .catch(err => console.error('Error:', err))
    }, 0)
  }

  if (loading && products.length === 0) {
    return <div className="loading">Loading products...</div>
  }

  if (error && products.length === 0) {
    return <div className="error">Error: {error}</div>
  }

  if (products.length === 0) {
    return <div className="no-products">No products found</div>
  }

  return (
    <div className="products-container">
      {/* Filter Controls */}
      <div className="filter-section">
        <h2>Search & Filter</h2>
        <div className="filter-inputs">
          <div className="input-group">
            <label htmlFor="limit">Limit:</label>
            <input
              id="limit"
              type="number"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 1)}
              placeholder="Enter limit"
            />
          </div>

          <div className="input-group">
            <label htmlFor="category">Category:</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Laptops, MobilePhone"
            />
          </div>

          <div className="button-group">
            <button className="search-btn" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button className="reset-btn" onClick={handleReset} disabled={loading}>
              Reset
            </button>
          </div>
        </div>

        {/* Current Query Display */}
        <div className="query-display">
          <p>
            <strong>Current Query:</strong>{' '}
            <code>
              /api/products?limit={limit}
              {category.trim() && `&category=${category.trim()}`}
              {currentCursor && `&cursor=${currentCursor.substring(0, 10)}...`}
            </code>
          </p>
        </div>
      </div>

      {/* Custom URL Section */}
      <div className="custom-url-section">
        <h2>Or Paste Custom URL</h2>
        <div className="custom-url-inputs">
          <div className="input-group full-width">
            <label htmlFor="customUrl">Full URL or Path:</label>
            <input
              id="customUrl"
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="e.g., /api/products?limit=50&category=Laptops or http://localhost:5000/api/products?cursor=..."
              onKeyPress={(e) => e.key === 'Enter' && handleCustomUrlFetch()}
            />
          </div>
          <button className="fetch-url-btn" onClick={handleCustomUrlFetch} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch URL'}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 && !loading ? (
        <div className="no-products">No products found</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p className="description">{product.description}</p>
                  )}
                  <div className="product-footer">
                    {product.price && (
                      <span className="price">${product.price}</span>
                    )}
                    {product.category && (
                      <span className="category">{product.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
