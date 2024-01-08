import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { Suspense, lazy } from "react";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/hooks/react-query/queries";
import GridPostList from "@/components/shared/GridPostList";
import SmallPostsFallback from "@/components/suspense-fallbacks/SmallPostsFallback";
import ProfileFallback from "@/components/suspense-fallbacks/ProfileFallback";
import FollowUserButton from "@/components/shared/FollowUserButton";

const InteractedPosts = lazy(() => import("./InteractedPosts"));

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: thisUser, isError } = useGetUserById(id || "");

  if (isError || !id) {
    return <p>کاربر مورد نظر یافت نشد</p>;
  }

  if (!thisUser) return <ProfileFallback />;

  return (
    <div className="profile-container">
      <Helmet>
        <title>{thisUser.name} صفحه</title>
      </Helmet>
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={thisUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-start h3-bold md:h1-semibold w-full">
                {thisUser.name}
              </h1>
              <p
                dir="auto"
                className="small-regular md:body-medium text-light-3 text-center xl:text-right"
              >
                @{thisUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={thisUser.posts.length} label="پست" />
              <StatBlock
                value={thisUser.followings.length}
                label="دنبال شونده"
              />
              <StatBlock
                value={thisUser.followers.length}
                label="دنبال کننده"
              />
            </div>

            {thisUser.bio && (
              <p className="small-medium md:base-medium text-center xl:text-start mt-7 max-w-screen-sm">
                {thisUser.bio}
              </p>
            )}
          </div>

          {user.id === thisUser.$id && (
            <Link
              to={`/update-profile/${thisUser.$id}`}
              className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                user.id !== thisUser.$id && "hidden"
              }`}
            >
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
              <p className="flex whitespace-nowrap small-medium">
                ویرایش پروفایل
              </p>
            </Link>
          )}
          {user.id !== id && (
            <FollowUserButton
              className="shad-button_primary px-8"
              currentUserFollowings={user.followings}
              targetUserId={id}
            />
          )}
        </div>
      </div>

      {thisUser.$id === user.id && (
        <div className="flex-center gap-3 w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            <span className="hidden lg:inline">پست های من</span>
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            <span className="hidden lg:inline">لایک شده ها</span>
          </Link>
          <Link
            to={`/profile/${id}/saved-posts`}
            className={`profile-tab rounded-lg ${
              pathname === `/profile/${id}/saved-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/bookmark.svg"}
              alt="like"
              width={20}
              height={20}
            />
            <span className="hidden lg:inline">ذخیره شده ها</span>
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={
            thisUser.posts.length === 0 ? (
              <p className="text-light-4 text-center w-full mt-10">
                شما هیچ پستی آپلود نکرده اید
              </p>
            ) : (
              <GridPostList posts={thisUser.posts} showUser={false} />
            )
          }
        />
        {thisUser.$id === user.id && (
          <>
            <Route
              path="/liked-posts"
              element={
                <Suspense fallback={<SmallPostsFallback count={6} />}>
                  <InteractedPosts
                    type="liked"
                    title="پست های لایک شده"
                    noResultText="شما هیچ پستی را لایک نکرده اید"
                  />
                </Suspense>
              }
            />
            <Route
              path="/saved-posts"
              element={
                <Suspense fallback={<SmallPostsFallback count={6} />}>
                  <InteractedPosts
                    type="saved"
                    title="پست های ذخیره شده"
                    noResultText="شما هیچ پستی را ذخیره نکرده اید"
                  />
                </Suspense>
              }
            />
          </>
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
