import { useEffect, useState } from 'react'
import './App.css'
import { Spinner } from './components/Spinner'

export default function App() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173/dev/'
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log(baseUrl);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params && params.code) {
      setIsLoading(true)
      const url = new URL(`${baseUrl}/auth/token`);
      url.searchParams.append('code', params.code);
      console.log(url.toString());

      fetch(url.toString())
        .then(result => result.json())
        .then(result => result.data.id_token)
        .then(idToken => fetch(`${baseUrl}/user`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        }))
        .then(result => result.json())
        .then(result => {
          setEmail(result.user.claims.email);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          setIsLoading(false)
        });
    }
  }, [baseUrl])

  const attemptLogin = () => {
    setIsLoading(true)
    fetch(`${baseUrl}/auth/login`)
      .then(result => {
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        return result.json();
      })
      .then(result => {
        if (result.login_url) {
          window.location.href = result.login_url;
          return;
        }
        alert('Login URL not returned from backend!');
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setIsLoading(false)
      });
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
