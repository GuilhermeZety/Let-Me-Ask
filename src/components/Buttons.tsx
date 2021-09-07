//react
import { ButtonHTMLAttributes } from 'react'

//scss
import '../assets/styles/button.scss';

////////////////////////////////////////////////////////////////////////////////

//type
//define as propriedades do botão como um botão normal do HTML
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

//exporta um botão em HTML
export function Button(props: ButtonProps) {
    return (
        <button className="Button" {...props}></button>
    )
}