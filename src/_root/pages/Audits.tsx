import FollowUserButton from "@/components/shared/FollowUserButton";
import { useUserContext } from "@/context/AuthContext";
import { useGetAudits } from "@/hooks/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Audits = () => {
  const { data: audits } = useGetAudits();
  const { user } = useUserContext();

  if (!audits) return;

  return (
    <div className="explore-container">
      <Helmet>
        <title>گزارش ها</title>
      </Helmet>
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/notification.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">گزارش ها</h2>
        </div>
        <ul className="flex flex-col gap-4 w-full">
          {audits.documents.map((audit) => {
            return (
              <li
                key={audit.$id}
                className="rounded-lg p-3 bg-dark-4 flex gap-3 w-full"
              >
                <Link
                  to={`/profile/${audit.initiativeUserId}`}
                  className="shrink-0 rounded-full"
                >
                  <img
                    src={
                      audit.initiativeUserImageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    className="rounded-full h-14 w-14"
                    alt={audit.initiativeUserUsername}
                  />
                </Link>
                <div className="flex-between gap-3 grow">
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/profile/${audit.initiativeUserId}`}
                      className="shrink-0 rounded-full"
                    >
                      <small dir="ltr" className="text-light-3">
                        @{audit.initiativeUserUsername}
                      </small>
                    </Link>
                    <p>{audit.message}</p>
                    <small>
                      <time className="text-light-4">
                        {multiFormatDateString(audit.$createdAt)}
                      </time>
                    </small>
                  </div>
                  {audit.postImageUrl ? (
                    <Link className="shrink-0" to={`/posts/${audit.postId}`}>
                      <img
                        src={
                          audit.postImageUrl ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        className="rounded-md h-20 w-20"
                        alt={audit.initiativeUserUsername}
                      />
                    </Link>
                  ) : (
                    <FollowUserButton
                      className="shad-button_primary px-4"
                      currentUserFollowings={user.followings}
                      targetUserId={audit.initiativeUserId}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Audits;
