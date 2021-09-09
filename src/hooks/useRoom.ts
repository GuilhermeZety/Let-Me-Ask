//react
import { useEffect, useState } from "react"
import { database } from "../Services/firebase"
import { useAuth } from "./useAuth";

//type
//tipos de informações que uma pergunta tem
type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
    likesCount: Number;
    LikedId: string | undefined;
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
    likes: Record<string, {
        authorId: string;
    }>;
}>

//exporta basicamente um hook para conectar usar a sala, retornando o titulo dela e todas as perguntas dela
export function useRoom(roomId: string) {

    const { user } = useAuth();

    //aqui ele seta que nessa sala tem um valor chamado title que precisa ter estado
    const [title, setTitle] = useState("")

    //aqui igualmente, porém, ele seta o tipo de estado, com ênfase que aqui ele recebe um array desses tipos
    const [questions, setQuestions] = useState<QuestionType[]>([])

    //seta um efeito
    useEffect(() => {
        //referencia tal linha no banco para que seja acessado, mostrado ou modificado
        const roomRef = database.ref(`rooms/${roomId}`);

        //entra na sala e pega os valores
        roomRef.on('value', room => {

            //acessa os valores da room, ou seja, tudo que contem nela...
            const databaseRoom = room.val()

            if (!databaseRoom) {
                return;
            }

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
                    likesCount: Object.values(value.likes ?? {}).length,
                    LikedId: Object.entries(value.likes ?? {}).find(([keyLiked, valueLiked]) => valueLiked.authorId === user?.id)?.[0],
                }
            })

            //after all, is set title for room based roomDatabase
            setTitle(databaseRoom.title)

            //set return question
            setQuestions(parsedQuestion)
        })

        return () => {
            roomRef.off("value")
        }
    }, [roomId, user?.id])

    //return the all questions in array and title the room
    return { questions, title }
}