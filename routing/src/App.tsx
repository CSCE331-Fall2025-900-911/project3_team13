import './App.css'

function App() {
  return (
    <div className="login-container">
      <h1>Welcome to BigTeaHub!</h1>
      <div className="login-box">
        <h1 className="login-title">Login in as a...</h1>
        <div className="route-buttons">
          <a href="http://localhost:5174">
            <button className="route-button">Customer</button>
          </a>
          <a href="http://localhost:5173">
            <button className="route-button">Cashier</button>
          </a>
          <a href="http://localhost:5175">
            <button className="route-button">Manager</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
