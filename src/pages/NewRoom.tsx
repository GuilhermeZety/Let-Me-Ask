//react
import { Link } from "react-router-dom"
import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom"

//components
import { Button } from '../components/Buttons'

//contexts
import { useAuth } from "../hooks/useAuth";

//imagens
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

//scss
import '../assets/styles/auth.scss';
import { database } from "../Services/firebase";
import toast, { Toaster } from "react-hot-toast";

////////////////////////////////////////////////////////////////////////////////

//função principal
export function NewRoom() {

    //usado para navegar entre telas
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    //função para Criar a sala
    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        //se não existir o nome da sala nao faz dada
        if (newRoom.trim() === '') {
            toast.error("nome da sala não inserida")
            return;
        }

        //definindo qual o nome do bloco criado no banco
        const roomRef = database.ref('rooms')

        //enviando informações para o banco
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        toast.success("Sala Criada Com Sucesso");

        /*se tudo der okay ira direcionar para a sala, com a key 
        (obs: esta sendo utilizado craze aqui (``) ao invés de ('') )*/
        history.push(`/rooms/${firebaseRoom.key}`);
    }

    //puxa os contextos compartilhados entre as telas
    const { user, signInWithGoogle } = useAuth();

    //return da função principal, retornando HTML
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

                    <h2>Crie Uma Nova Sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome Da Sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />

                        <Button type="submit">Criar Sala</Button>
                    </form>
                    <p>Quer entrar em uma sala ja existente? <Link to="/">Clique Aqui</Link></p>
                    <p>Não está na conta correta? <Link to="#" onClick={signInWithGoogle}>Clique Aqui</Link></p>
                </div>
            </main>
        </div>
    )
}