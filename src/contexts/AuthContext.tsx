import { createContext, ReactNode, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { firebase, auth } from "../Services/firebase";

//Types

//Define Quais objetos serão transmitidos pelas telas
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

//Definindo o que o usuário possui
type User = {
    id: string;
    name: string;
    avatar: string;
}

//define que a função pode receber children 
type AuthContextProviderProps = {
    children: ReactNode;
}

//Exporta todas as informações transmitidas
export const AuthContext = createContext({} as AuthContextType);

//exporta toda a função de contexto que retorna o usuário
export function AuthContextProvider(props: AuthContextProviderProps) {
    //define o objeto User
    const [user, setUser] = useState<User>();

    /*seta para que toda vez que a pagina é recarregada ou acessada novamente após algum tempo 
    verificar se existe ainda um usuário logado*/
    useEffect(() => {
        //observador que verifica se o Auth ou seja a autenticação sofreu ou não mudança
        const unsubscribe = auth.onAuthStateChanged(user => {

            //se existir um usuário logado faz o código dentro do if
            if (user) {

                //coleta as seguintes informações dentro do usuário já logado
                const { displayName, photoURL, uid } = user;

                //verifica se usuário é válido
                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.')
                }

                //seta as informações do usuário logado nas variáveis locais para mandar para demais telas
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
                toast.success("Usuário Conectado")
            }
        })

        //retorna a verificação para que não fique infinitamente verificando
        return () => {
            unsubscribe();
        }
    }, [])

    //função para logar com o google
    async function signInWithGoogle() {

        //puxa as informações necessárias para um login com o google
        const provider = new firebase.auth.GoogleAuthProvider();

        //seta que o login vai ser feito em popup com o google, listado a cima
        const result = await auth.signInWithPopup(provider);

        //pega o usuário se houver o login
        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            //verifica se usuário é válido
            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.')
            }

            //seta as informações do usuário logado nas variáveis locais para mandar para demais telas
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
            toast.success("Usuário Conectado Com Sucesso")
        }
    }

    //retorna as informações do usuário junto com a função de logar com o google em popup, colocando o props.children
    //para que possa ser adicionado rotas ao meio
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}