import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import FollowUserButton from "./FollowUserButton";
import { useUserContext } from "@/context/AuthContext";

type AuditListProps = {
  audits: Models.Document[];
};

const AuditList = ({ audits }: AuditListProps) => {
  const { user } = useUserContext();

  return audits.map((audit) => {
    return (
      <li
        key={audit.$id}
        className="rounded-lg p-3 bg-dark-4 flex items-center gap-3 w-full"
      >
        <Link
          to={`/profile/${audit.initiativeUserId}`}
          className="shrink-0 rounded-full relative"
        >
          <img
            src={
              audit.initiativeUserImageUrl ||
              "/assets/icons/profile-placeholder.svg"
            }
            className="rounded-full h-14 w-14"
            alt={audit.initiativeUserUsername}
          />
          {audit.auditType === "like" ? (
            <img
              src="/assets/icons/liked.svg"
              alt="liked icon"
              className="absolute -top-2 -start-0 w-5 h-5"
            />
          ) : audit.auditType === "comment" ? (
            <img
              src="/assets/icons/comment.svg"
              alt="comment icon"
              className="absolute -top-2 -start-0 w-5 h-5"
            />
          ) : null}
        </Link>
        <div className="flex-between gap-3 grow">
          <div className="flex flex-col gap-1">
            <Link
              to={`/profile/${audit.initiativeUserId}`}
              className="shrink-0 rounded-full"
            >
              <small dir="ltr" className="text-light-3">
                @{audit.initiativeUserUsername}
              </small>
            </Link>
            <p className="whitespace-break-spaces">{audit.message}</p>
            <small>
              <time className="text-light-4">
                {multiFormatDateString(audit.$createdAt)}
              </time>
            </small>
          </div>
          {audit.auditType === "like" ? (
            <Link className="shrink-0" to={`/posts/${audit.postId}`}>
              <img
                src={audit.postImageUrl}
                className="rounded-md h-20 w-20"
                alt="تصویر پست لایک شده"
              />
            </Link>
          ) : audit.auditType === "follow" ? (
            <FollowUserButton
              className="shad-button_primary px-4"
              currentUserFollowings={user.followings}
              targetUserId={audit.initiativeUserId}
            />
          ) : audit.auditType === "comment" ? (
            <Link className="shrink-0" to={`/posts/${audit.postId}`}>
              <img
                src={audit.postImageUrl}
                className="rounded-md h-20 w-20"
                alt="تصویر پست کامنت گذاری شده"
              />
            </Link>
          ) : (
            <Link
              className="shrink-0"
              to={`/profile/${audit.initiativeUserId}`}
            >
              <img
                src="/assets/images/icon.svg"
                className="rounded-md h-20 w-20"
                alt={audit.initiativeUserUsername}
              />
            </Link>
          )}
        </div>
      </li>
    );
  });
};

export default AuditList;
