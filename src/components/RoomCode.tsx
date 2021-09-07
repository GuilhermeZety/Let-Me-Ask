//react
import toast from 'react-hot-toast';

//Imagens
import copyImg from '../assets/images/copy.svg'

//scss
import '../assets/styles/room-code.scss';

////////////////////////////////////////////////////////////////////////////////

//type
//seta quais valores serão usados dentro dessa RoomCode, definindo-a na "Sala"
type roomCodeProps = {
    code: string;
}

//exporta a função principal como uma tag
export function RoomCode(props: roomCodeProps) {

    //função que copia uma string como ctrl + c
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)

        toast.success('Código Copiado com Sucesso')
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy Room Code" />
            </div>
            <span>Sala {props.code}</span>
        </button>
    )
};