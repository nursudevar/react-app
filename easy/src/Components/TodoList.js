import React, { useState, useRef } from 'react'
import TodoForm from './TodoForm'
import Todo from './Todo'

const TodoList = () => {

  const [todos, setTodos] = useState ([]);

  const addTodo = todo => {
    if(!todo.text || /^\s*$/.test(todo.text)){
      return;
    }

    const newTodos = [todo, ...todos];
    setTodos(newTodos);
    console.log(...todos)
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)){
      return;
    }

    setTodos((prev) => 
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };
  
  const removeTodo = id => {
    const removedArr = [...todos].filter(todo => todo.id !== id);
    setTodos(removedArr);
  }

  const completeTodo = id => {
    let updateTodos = todos.map((todo) => {
      if(todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updateTodos);
  };

  return <>
  <h1>What's the Plan?</h1>
  <TodoForm onSubmit={addTodo}/>
  <Todo todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo}/>
  </>
};

export default TodoList