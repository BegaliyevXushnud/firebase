"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

// User interface
interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [editUser, setEditUser] = useState<User | null>(null); // Track the user being edited
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const usersCollectionRef = collection(db, "user");

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[]);
  };
  

  const handleCreateUsers = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!nameRef.current || !ageRef.current || !phoneRef.current) return;

    const newUser: Omit<User, "id"> = {
      name: nameRef.current.value,
      age: parseInt(ageRef.current.value),
      phone: phoneRef.current.value,
    };
    await addDoc(usersCollectionRef, newUser);
    setMessage("User added successfully!");
    nameRef.current.value = "";
    ageRef.current.value = "";
    phoneRef.current.value = "";
    getUsers();
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editUser) return;

    const oneUserRef = doc(db, "user", editUser.id);
    await updateDoc(oneUserRef, {
      name: editUser.name,
      age: editUser.age,
      phone: editUser.phone,
    });
    setMessage("User updated successfully!");
    setIsModalOpen(false);
    getUsers();
  };

  const handleDelete = async (id: string) => {
    const oneUserRef = doc(db, "user", id);
    await deleteDoc(oneUserRef);
    setMessage("User deleted successfully!");
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="p-6 xl:w-[700px] m-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <form
        onSubmit={handleCreateUsers}
        className="flex flex-col items-start gap-4 bg-gray-100 p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          className="w-full h-10 border border-gray-300 rounded-lg px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          ref={nameRef}
        />
        <input
          type="number"
          className="w-full h-10 border border-gray-300 rounded-lg px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Age"
          ref={ageRef}
        />
        <input
          type="text"
          className="w-full h-10 border border-gray-300 rounded-lg px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone"
          ref={phoneRef}
        />
        <button
          type="submit"
          className="w-full h-10 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Submit
        </button>
      </form>

      {message && (
        <div className="mt-4 text-green-600 font-semibold">{message}</div>
      )}

      <ul className="mt-6 space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">
              Name: {user.name} <br />
              Age: {user.age} <br />
              Phone: {user.phone}
            </span>
            <div>
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Name"
            />
            <input
              type="number"
              value={editUser.age}
              onChange={(e) =>
                setEditUser({ ...editUser, age: parseInt(e.target.value) || 0 })
              }
              className="w-full mb-3 p-2 border rounded"
              placeholder="Age"
            />
            <input
              type="text"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
              placeholder="Phone"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
