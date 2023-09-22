import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  updateTodo,
  sortTodo,
  toggleCompleted,
} from "../ToDoSlice";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import empty from "../assets/empty.jpg";
import jsonData from "../todoData.json";


function TodoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set data dari JSON ke dalam store Redux saat komponen dimuat
    dispatch(setTodoList(jsonData)); // Menggunakan data JSON yang telah diimpor
  }, [dispatch]);

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, []);

  const handleAddTodo = (task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(addTodo({ task: task, id: Date.now() }));
      setNewTask("");
    }
  };
  const handleUpdateToDoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(updateTodo({ task: task, id: id }));
      setShowModal(false);
      setNewTask("")
    }
  };
  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  function handleSort(sortCriteria) {
    dispatch(sortTodo(sortCriteria));
  }

  const sortToDoList = todoList.filter((todo) => {
    if (sortCriteria === "All") return true;
    if (sortCriteria === "Completed" && todo.completed) return true;
    if (sortCriteria === "Not Completed" && !todo.completed) return true;
    return false;
  });

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };
  return (
    <div>
      <div className="container mx-auto mt-6">
    <div className="flex flex-col items-center mb-4">
      <div className="text-center text-4xl font-bold mb-5">
        ToDoSearch
      </div>
      <div className="flex items-start mb-2"> 
        <div className="bg-sunsetOrange text-white p-3 rounded-md">
          <BsSearch />
        </div>
        <input
          type="text"
          className="border p-2 rounded-md outline-none "
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-start mt-2"> 
        <button
          className="bg-sunsetOrange text-white p-2 rounded-md mb-2 mr-2 "
          onClick={() => {
            const filteredTodos = todoList.filter((todo) =>
              todo.task.toLowerCase().includes(searchTerm.toLowerCase())
            );
            dispatch(setTodoList(filteredTodos));
          }}
        >
          Search
        </button>

        <button
          className="bg-sunsetOrange text-white p-2 rounded-md"
          onClick={() => {
            // Mereset nilai pencarian dan mengembalikan daftar tugas ke nilai awal
            setSearchTerm("");
            dispatch(setTodoList(jsonData)); // Menggunakan data JSON awal
          }}
        >
          Reset
        </button>
      </div>
      <div className="ml-auto mt-2"> 
        <button
          className="bg-sunsetOrange text-white py-3 px-10 rounded-md"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  </div>
  
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center">
          <div className="bg-white p-8 rounded-md w-">
            <input
              className="border p-2 rounded-md outline-none mb-5"
              style={{ width: '100%' }}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={
                currentTodo ? "Update your task here" : "Enter your task here"
              }
            />
            <div className="flex justify-between ">
              {currentTodo ? (
                <>
                <button
                    className="bg-Tangaroa rounded-md text-white py-3 px-10"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleUpdateToDoList(currentTodo.id, newTask);
                    }}
                    className="bg-sunsetOrange text-white py-3 px-10 rounded-md ml-7"
                  >
                    Save
                  </button>
                  
                </>
              ) : (
                <>
                  <button
                    className="bg-Tangaroa rounded-md text-white py-3 px-10 "
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-sunsetOrange text-white py-3 px-10 rounded-md ml-7"
                    onClick={() => {
                      handleAddTodo(newTask);
                      setShowModal(false);
                    }}
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className=" flex items-center justify-center flex-col">
        {todoList.length === 0 ? (
          <div className="mb-6">
            <div className="sm:w-[500px] sm:h-[500px] min-w-[250px] min-[250px]">
              <img src={empty} alt="" />
            </div>
            <p className="text-center text-Gray">
              You have no todos, please add one.
            </p>
          </div>
        ) : (
          <div className="container mx-auto mt-6">
            <div className="flex justify-center mb-6">
              <select
                onChange={(e) => handleSort(e.target.value)}
                className="p-1 outline-none text-sm"
              >
                <option value="All" className="text-sm">
                  All
                </option>
                <option value="Completed" className="text-sm">
                  Completed
                </option>
                <option value="Not Completed" className="text-sm">
                  Not Completed
                </option>
              </select>
            </div>

            <div>
              {sortToDoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between mb-6 bg-Tangaroa mx-auto w-full md:w-[75%] rounded-md p-4"
                >
                  <span
                      className={todo.completed ? "line-through text-greenTeal" : "text-sunsetOrange"}
                    >
                      {todo.task}
                    </span>

                  
                    
                    
                  
                  {/* <div
                    className={`${
                      todo.completed
                        ? "line-through text-greenTeal"
                        : "text-sunsetOrange"
                    }`}
                    onClick={() => {
                      handleToggleCompleted(todo.id);
                    }}
                  >
                    {todo.task}
                  </div> */}
                  <div>
                  <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleCompleted(todo.id)}
                      className="form-checkbox h-5 w-5 bg-black border border-gray-500 rounded"
                    />
                    <button
                      className="bg-blue-500 text-white p-1 rounded-md ml-2"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentTodo(todo);
                        setNewTask(todo.task);
                      }}
                    >
                      <TiPencil />
                    </button>
                    <button
                      className="bg-sunsetOrange text-white p-1 rounded-md ml-2"
                      onClick={() => handleDeleteToDo(todo.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* <button
          className="bg-sunsetOrange text-center text-white py-3 px-10 rounded-md"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Task
        </button> */}
      </div>
      
    </div>
  );
}

export default TodoList;
