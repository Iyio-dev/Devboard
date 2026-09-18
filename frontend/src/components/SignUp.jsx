import React from 'react'
import api from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const signUp = await api.post('/auth/sign-up', {
                name: name,
                email: email,
                password: password
            })

            const token = signUp.data.token

            localStorage.setItem('token', token)
            useNavigate('/dashboard')

            window.dispatchEvent(new Event('authChanged'))

        } catch (error) {
            setError(error.response?.data?.message)
        }
        finally {
            setIsLoading(false)
        }
    }

  return (
    <div>
      
    </div>
  )
}

export default SignUp
