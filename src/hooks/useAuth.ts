import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

//basicamente ele exporta a junção necessária para que consiga acessar as informações da autenticação
export function useAuth() {
    const value = useContext(AuthContext)
    return value;
}