import { Routes, Route } from "react-router-dom";
import { Homepage } from "../components/homepage/home";
import { Login } from "../components/auth/login";
// import { PrivateRoute } from "../components/auth/PrivateRouter";
import { Navbar } from "../components/navbar/Navbar";
import { Post } from "../components/profile/Post";
import { Friends } from "../components/profile/Friends";
import { Photos } from "../components/profile/Photos";
import { FriendRequest } from "../components/friends/FriendRequest";
import { UserPost } from "../components/userProfile/UserPost";
import { UserAbout } from "../components/userProfile/UserAbout";
import { UserPhotos } from "../components/userProfile/UserPhotos";
import { ProfileNav } from "../components/profile/ProfileNav";
import { UserProfileNav } from "../components/userProfile/UserProfileNav";
import { Groups } from "../components/groups/Groups";
import SearchPage from "../components/filter/SearchPage";
import { ChatConnProvider } from "../context/ChatConnContext";
import { ChatBoxProvider } from "../context/ChatBoxContext";
import { CallConnProvider } from "../context/CallConnContext";

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          // <PrivateRoute>
          //   <Navbar />
          // </PrivateRoute>
          <CallConnProvider>
            <ChatConnProvider>
              <ChatBoxProvider>
                <Navbar />
              </ChatBoxProvider>
            </ChatConnProvider>
          </CallConnProvider>
        }
      >
        <Route path="/" element={<Homepage />} />
        <Route path="groups" element={<Groups />} />
        <Route path="friends" element={<FriendRequest />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="profile" element={<ProfileNav />}>
          <Route path="" element={<Post />} />
          <Route path="friends" element={<Friends />} />
          <Route path="photos" element={<Photos />} />
        </Route>
        {/* <Route path="userprofile" element={<UserProfileNav />}>
          <Route path="" element={<UserPost />} />
          <Route path="about" element={<UserAbout />} />
          <Route path="photos" element={<UserPhotos />} />
        </Route> */}
      </Route>
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
};
