import "./UsersTable.scss";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

export default function UsersTable({
  users,
  updateUsers,
}: {
  users: User[] | null;
  updateUsers: (data: User[]) => Promise<void>;
}) {
  const { user: usr } = useAuth();

  const deleteUser = async (username: string) => {
    await axios.delete("/users", {
      data: { username },
    });
    if (users) {
      updateUsers(users.filter((user) => user.username !== username));
    }
  };

  return (
    <table className="users-table">
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
              <td className="text-xs">{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td className="max-w-lg text-xs">
                {user.permissions.join(", ")}
              </td>
              <td className="flex gap-1 text-lg font-bold">
                <span className="cursor-pointer text-orange-400 hover:brightness-125 hover:scale-105 transition">
                  <TbEdit />
                </span>
                <span
                  onClick={
                    user.id !== usr?.userId
                      ? () => deleteUser(user.username)
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
