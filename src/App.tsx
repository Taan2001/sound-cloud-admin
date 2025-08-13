import { useState } from "react";
import InputTodo from "./todo/input.todo";

function App() {
  const [listTodo, setListTodo] = useState<string[]>([]);

  const handleTest = () => {
    console.log("Test function called");
  };

  return (
    <div>
      <InputTodo
        ericFunction={handleTest}
        listTodo={listTodo}
        setListTodo={setListTodo}
      />
      <ul>
        {listTodo.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
