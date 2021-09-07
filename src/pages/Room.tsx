//react
import { FormEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast";

//hooks
import { useAuth } from "../hooks/useAuth";

//components
import { Button } from "../components/Buttons";
import { RoomCode } from "../components/RoomCode";

//images
import logoImg from "../assets/images/logo.svg";

//scss
import "../assets/styles/room.scss"
import { database } from "../Services/firebase";
import { Question } from "../components/Question";

////////////////////////////////////////////////////////////////////////////////

//type
//define que tipo de paramentos ele vai receber 
type RoomsParams = {
    id: string;
}

//seta um objeto/tipo para que seja escrevido as coisas do banco, aqui, localmente
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
}


//função principal da sala
export function Room() {
    //puxa os contextos compartilhados entre as telas
    const { user, signInWithGoogle } = useAuth()

    //recebe ps parâmetros do http la de cima
    const params = useParams<RoomsParams>();

    //deixando mais explicito o id dos parâmetros
    const roomId = params.id;

    //seta um estado para a a nova pergunta
    const [newQuestion, setNewQuestion] = useState("");

    const [title, setTitle] = useState("")

    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        //referencia tal linha no banco para que seja acessado, mostrado ou modificado
        const roomRef = database.ref(`rooms/${roomId}`);

        //entra na sala e pega os valores
        roomRef.on('value', room => {

            //acessa os valores da room, ou seja, tudo que contem nela...
            const databaseRoom = room.val()

            //puxa todas as question, no modelo type firebaseQuestions
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            //aqui é onde ele converte o modelo em objeto vindo do banco para aray para uso local
            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                }
            })

            setTitle(databaseRoom.title)

            setQuestions(parsedQuestion)
        })
    }, [roomId])

    //função para criar uma nova função
    async function handleCreateNewQuestion(event: FormEvent) {
        event.preventDefault();

        //verifica se foi digitado a pergunta
        if (newQuestion.trim() === "") {
            toast.error("não inserido texto da pergunta")
            return;
        }

        //verifica se o usuário está logado
        if (!user) {
            return toast.error("nenhum usuário logado")
        }

        //cria a pergunta
        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        }

        //seta o local no banco que vai ser salvo a pergunta
        await database.ref(`rooms/${roomId}/questions`).push(question);

        //após finalizado, limpa o textarea
        setNewQuestion("");

        toast.success('Pergunta Enviada Com Sucesso')
    }

    //retorna um valor em html
    return (
        <div id="page-room">
            <header>
                <div><Toaster /></div>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <div className="rightHeader">
                        <RoomCode code={roomId} />
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 ? (<span>{questions.length} pergunta{questions.length > 1 && "s"}</span>) :
                        (<span>Nenhuma Pergunta</span>)
                    }
                </div>

                <form onSubmit={handleCreateNewQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {/* faz um if e else */}
                        {user ? (
                            <div className="user-info">
                                <img src={user?.avatar} alt={user?.name} />
                                <span>{user?.name || "Usuário Não Logado"}</span>
                            </div>
                        ) : (
                            <span>
                                Para enviar uma pergunta,
                                <Link to="#" onClick={signInWithGoogle}>faça seu login</Link>
                            </span>
                        )}
                        <Button type="submit" disabled={!user} >Enviar Pergunta</Button>
                    </div>
                </form>

                {questions.map(question => {
                    return (
                        <Question content={question.content} author={question.author} />
                    )
                }
                )}
            </main>
        </div >
    )
}