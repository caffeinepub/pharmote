import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import ProfileSetup from "./components/ProfileSetup";
import Home from "./pages/Home";
import Library from "./pages/Library";
import NoteDetail from "./pages/NoteDetail";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";

const ONBOARDING_KEY = "pharmote_onboarding_done";
const PROFILE_KEY = "pharmote_profile";

function RootLayout() {
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === "true",
  );
  const [profileDone, setProfileDone] = useState(
    () => !!localStorage.getItem(PROFILE_KEY),
  );

  if (!onboardingDone) {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem(ONBOARDING_KEY, "true");
          setOnboardingDone(true);
        }}
      />
    );
  }

  if (!profileDone) {
    return <ProfileSetup onComplete={() => setProfileDone(true)} />;
  }

  return (
    <div className="max-w-lg mx-auto relative">
      <Outlet />
      <BottomNav />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: Upload,
});
const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes/$id",
  component: NoteDetail,
});
const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: Library,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  uploadRoute,
  noteDetailRoute,
  libraryRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
