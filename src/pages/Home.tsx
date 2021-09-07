//react
import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"

//contexts
import { useAuth } from '../hooks/useAuth'

//components
import { Button } from '../components/Buttons'

//image
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

//css
import '../assets/styles/auth.scss';
import { database } from "../Services/firebase"
import toast, { Toaster } from "react-hot-toast"

////////////////////////////////////////////////////////////////////////////////

//function principal
export function Home() {
    //usado para navegar entre telas
    const history = useHistory();

    //puxa a autenticação, usuário e a function para logar
    const { user, signInWithGoogle } = useAuth();

    //função para logar se não estiver usuário validado
    async function handleCreateRoom() {

        //se usuário nao estiver autenticado, chama login
        if (!user) {
            await signInWithGoogle();
        }

        toast.success("Logado Com Sucesso!")

        //se autenticação ocorrer com sucesso joga o usuário para tela de criar nova sala
        history.push("/rooms/new");
    }

    //cria novo parâmetro que recebe o código da sala
    const [roomCode, setRoomCode] = useState('')

    //function para acessar a sala ja existente
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        //se não for adicionado o código da sala no input ele não faz nada
        if (roomCode.trim() === '') {
            toast.error("nenhum código inserido")
            return;
        }

        //pega tela com o código da sala e verifica se tal sala existe, retorna a referencia da sala
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        //se a sala com tal código não existir, retorna alert com erro
        if (!roomRef.exists()) {
            toast.error('Room dos not exists');
            return;
        }

        toast.success(`Logando na sala`)

        //se tudo ocorrer bem, redireciona para a sala com o código da sala
        history.push(`/rooms/${roomCode}`);
    }

    //return principal
    return (
        <div id="page-auth" >
            <div><Toaster /></div>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando Perguntas e Respostas" />
                <strong>"Crie Salas Ao Vivo Q&amp;A ao vivo"</strong>
                <p>Tire As Duvidas Do Pessoal Da Live Em Tempo Real</p>
            </aside>

            <main>
                <div className="main-content">

                    <img src={logoImg} alt="letMeAsk" />

                    <button onClick={handleCreateRoom} className="acess-with-google" >
                        <img src={googleIconImg} alt="Logo Da Google" />
                        Crie Sua Sala Com O Google
                    </button>

                    <div className="separator">Ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o Código Da Sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />

                        <Button type="submit">Entrar Na Sala</Button>
                    </form>

                </div>
            </main>
        </div>
    )

}