//scss
import { ReactNode } from "react"
import "./styles.scss"
import cx from "classnames"

//type
//define as propriedades presentes nas questões, ou seja, o que vai navegar junto a elas
type questionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}
//função principal... vai criar uma div de pergunta bonitinho para implementar
export function Question({ content, author, children, isAnswered = false, isHighLighted = false }: questionProps) {
    return (
        <div
            className={
                cx(
                    "question",
                    { answered: isAnswered },
                    { highlighted: isHighLighted && !isAnswered },
                )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}