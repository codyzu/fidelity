import type User from './user';

export default function UserDisplay({user}: {user?: User}) {
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center my-4">
      <div className="flex mb-4">
        <div className="mr-2 text-2xl">{user.phoneNumber ?? user.email}</div>
        {user.admin && (
          <div className="bg-red-6 text-white rounded-full px-4 flex items-center justify-center text-sm font-semibold">
            <div>admin</div>
          </div>
        )}
      </div>
      <div>points: {user.points}</div>
    </div>
  );
}
