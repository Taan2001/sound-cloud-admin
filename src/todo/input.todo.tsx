import { useState } from "react";
interface IProps {
    listTodo: string[];
    setListTodo: (list: string[]) => void;
    ericFunction?: () => void;
}

function InputTodo(props: IProps) {
    const { listTodo, setListTodo } = props;

    const [todo, setTodo] = useState<string>('');
    const handleClick = () => {
        if (!todo) {
            alert('Please enter a todo item');
            return;
        }

        setListTodo([...listTodo, todo]);
        setTodo('');
    };

    return (
        <div>
            <div>Add new todo</div>
            <input 
                value={todo}
                type="text"
                onChange={(event) => {
                    setTodo(event.target.value);
                }}
            />
            &nbsp; &nbsp;
            <button onClick={() => handleClick()}>Save</button>
        </div>
  );
}

export default InputTodo;