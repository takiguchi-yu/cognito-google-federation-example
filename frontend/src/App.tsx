import { useEffect, useState } from 'react'
import './App.css'
import { Spinner } from './components/Spinner'

export default function App() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost/dev/'
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params && params.code) {
      setIsLoading(true);
      // TODO: tokenAPI && userAPI を呼び出してデータを取得する
      setTimeout(() => {
        setEmail('test@example.com')
        setIsLoading(false)
      }, 5000);
    }
  }, [baseUrl])

  const attemptLogin = () => {
    setIsLoading(true)
    // TODO: loginAPIを呼び出してデータを取得する
    setTimeout(() => {
      setEmail('test@example.com')
      setIsLoading(false)
    }, 3000);
  }

  return (
    <div className='max-w-7xl mx-auto p-8 text-center relative'>

      <h1 className='text-3xl font-bold'>Amazon Cognito + Google</h1>
      <p>
        Using AWS CDK to deploy the required infrastructure, to create a Cognito UserPool, with Google federated
        identity integration, so your application users can use their Google account to login directly to your app.
      </p>

      {!email && (
        <button
          className={`inline-flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={attemptLogin}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          Login with Google
        </button>
      )}

      {email && (
        <div className="mt-4">
          Welcome, {email}
        </div>
      )}

    </div >
  )
}
