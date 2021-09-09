//react
import { ButtonHTMLAttributes } from 'react'

//scss
import './styles.scss';

////////////////////////////////////////////////////////////////////////////////

//type
//define as propriedades do botão como um botão normal do HTML
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

//exporta um botão em HTML
export function Button({ isOutlined = false, ...props }: ButtonProps) {
    return (
        <button className={`Button ${isOutlined ? 'Outlined' : ''}`} {...props}></button >
    )
}