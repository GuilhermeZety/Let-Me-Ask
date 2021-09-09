//react
import { FormEvent } from "react";
import { useParams, useHistory } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast";

//hooks
import { useRoom, } from "../hooks/useRoom";

//components
import { RoomCode } from "../components/RoomCode/index";
import { Question } from "../components/Question/index";

//images
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";

//scss
import "../assets/styles/room.scss"
import { database } from "../Services/firebase";
import { Button } from "../components/Buttons";


////////////////////////////////////////////////////////////////////////////////

//define que tipo de paramentos ele vai receber 
type RoomsParams = {
    id: string;
}

//função principal da sala
export function AdminRoom() {

    //recebe ps parâmetros do http la de cima
    const params = useParams<RoomsParams>();

    //deixando mais explicito o id dos parâmetros
    const roomId = params.id;

    //usado para navegar entre telas
    const history = useHistory();

    const { questions, title } = useRoom(roomId);

    async function endRoom(event: FormEvent) {
        event.preventDefault();

        //seta o local no banco que vai ser salvo a pergunta
        await database.ref(`rooms/${roomId}`).remove();

        toast.success('Sala Encerrada com Sucesso!')

        history.push('/');
    }

    function handleDeleteQuestion(questionId: string) {

        ///////MODAL/////// 

        if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {

            database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

            toast.success('question has deleted!');
        }
    }
    function handleCheckQuestionAnswered(questionId: string, isAnswered: boolean) {

        ///////MODAL/////// 

        database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isAnswered,
            isHighLighted: false,
        });


        toast.success('question marked with answered!');

    }
    function handleAnsweringQuestion(questionId: string, isHighLighted: boolean) {

        ///////MODAL/////// 

        database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: !isHighLighted,
        });

        toast.success('question mark with emphasis');

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
                        <Button onClick={endRoom} isOutlined >EncerrarSala</Button>
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

                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAnswered(question.id, question.isAnswered)}
                                >
                                    <img src={checkImg} alt="Mark if question answered" />
                                </button>

                                {!question.isAnswered && (
                                    <button
                                        className={`high-light ${question.isHighLighted ? 'highlighted' : ''}`}
                                        type="button"
                                        onClick={() => handleAnsweringQuestion(question.id, question.isHighLighted)}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>)
                                }
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="remove question" />
                                </button>
                            </Question>
                        )
                    }
                    )}
                </div>
            </main>
        </div>
    )
}