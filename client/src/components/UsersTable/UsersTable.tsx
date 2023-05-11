import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "@hooks/useAuth";
import axios from "@/api/axios";

import "./UsersTable.scss";

export default function UsersTable({
  users,
  updateUsers,
}: {
  users: User[] | null;
  updateUsers: () => Promise<void>;
}) {
  const { user: usr } = useAuth();

  const deleteUser = async (id: string) => {
    await axios.delete(`/api/users/${id}`);
    if (users) {
      updateUsers();
    }
  };

  const updateUser = async (user: User) => {
    await axios.put(`/api/users/${user.id}`, {
      role: user.roleName === "admin" ? "user" : "admin",
    });
    if (users) {
      updateUsers();
    }
  };

  return (
    <table className="users-table w-full">
      <thead>
        <tr>
          <td>Id</td>
          <td>Username</td>
          <td>Role</td>
          <td>Permissions</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.roleName}</td>
              <td className="max-w-lg text-xs">
                {user.role?.permissions
                  .map((p) => {
                    return p.name;
                  })
                  .join(", ")}
              </td>
              <td className="flex gap-1 text-lg font-bold">
                <span
                  onClick={
                    user.id !== usr?.userId ? () => updateUser(user) : undefined
                  }
                  className="cursor-pointer text-orange-400 hover:brightness-125 hover:scale-105 transition"
                >
                  <TbEdit />
                </span>
                <span
                  onClick={
                    user.id !== usr?.userId
                      ? () => deleteUser(user.id)
                      : undefined
                  }
                  className={`transition ${
                    user.id !== usr?.userId
                      ? "cursor-pointer text-red-700 hover:brightness-125 hover:scale-105"
                      : "text-zinc-300 cursor-default"
                  }`}
                >
                  <MdDeleteOutline />
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
