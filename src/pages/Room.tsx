//react
import { FormEvent, useState } from "react";
import { useParams, Link } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast";

//hooks
import { useAuth } from "../hooks/useAuth";
import { useRoom, } from "../hooks/useRoom";

//components
import { Button } from "../components/Buttons/index";
import { RoomCode } from "../components/RoomCode/index";
import { Question } from "../components/Question/index";

//images
import logoImg from "../assets/images/logo.svg";

//scss
import "../assets/styles/room.scss"
import { database } from "../Services/firebase";

////////////////////////////////////////////////////////////////////////////////

//define que tipo de paramentos ele vai receber 
type RoomsParams = {
    id: string;
}

//função principal da sala
export function Room() {
    //puxa os contextos compartilhados entre as telas
    const { user, signInWithGoogle } = useAuth()

    //recebe ps parâmetros do http la de cima
    const params = useParams<RoomsParams>();

    //deixando mais explicito o id dos parâmetros
    const roomId = params.id;

    const { questions, title } = useRoom(roomId);

    //seta um estado para a a nova pergunta
    const [newQuestion, setNewQuestion] = useState("");

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

    async function handleLikeQuestion(questionId: string, likedId?: string) {
        debugger;
        if (likedId) {
            database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likedId}`).remove()
        }
        else {
            database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }
    }

    //retorna um valor em html
    return (
        <div id="page-room">
            <header>
                <div><Toaster /></div>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <RoomCode code={roomId} />
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

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                                {!question.isAnswered && (<button
                                    className={`like-button ${question.LikedId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Mark As You Like"
                                    onClick={() => handleLikeQuestion(question.id, question.LikedId)}
                                >
                                    {question.likesCount > 0 && <span>{question.likesCount}</span>}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                </button>)}
                            </Question>
                        )
                    }
                    )}
                </div>
            </main>
        </div >
    )
}