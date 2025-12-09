import './App.css'

function App() {
  return (
    <div className="login-container">
      <h1>Welcome to BigTeaHub!</h1>
      <div className="login-box">
        <h1 className="login-title">Login in as a...</h1>
        <div className="route-buttons">
          <a href="https://customer-project3-team13.vercel.app/">
            <button className="route-button">Customer</button>
          </a>
          <a href="https://cashier-project3-team13.vercel.app/">
            <button className="route-button">Cashier</button>
          </a>
          <a href="https://manager-project3-team13.vercel.app/">
            <button className="route-button">Manager</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
