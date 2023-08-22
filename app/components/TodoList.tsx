'use client';

import { useState } from 'react';
import { trpc } from '../_trpc/client';
import { serverClient } from '../_trpc/serverClient';

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)['getTodos']>>;
}) {
  const [content, setContent] = useState('');

  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const handleTodo = () => {
    if (content.length) {
      addTodo.mutate(content);
      setContent('');
    }
  };
  const handleOnChange = (todo: any) => {
    setDone.mutate({
      id: todo.id,
      done: todo.done ? 0 : 1,
    });
  };

  return (
    <div>
      {/* <div>{JSON.stringify(getTodos.data)}</div> */}
      <div className=" my-5 text-2xl">
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={() => handleOnChange(todo)}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black border px-3 py-2 ml-2"
        />
        <button
          onClick={handleTodo}
          className="border px-4 py-2 bg-slate-500 rounded-lg ml-2 text-white hover:bg-slate-700"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
