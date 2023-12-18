import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutaions";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  const { user } = useUserContext();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">همه کاربران</h2>
        </div>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => {
              if (user.id === creator.$id) return;

              return (
                <li
                  key={creator?.$id}
                  className="flex-1 min-w-[200px] w-full  "
                >
                  <UserCard user={creator} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
