import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Library from "./pages/Library";
import NoteDetail from "./pages/NoteDetail";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";

const ONBOARDING_KEY = "pharmote_onboarding_done";

// Root layout
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === "true",
  );

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingDone(true);
  };

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && profile === null;

  if (!onboardingDone) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  if (isInitializing || (profileLoading && !isFetched)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto relative">
      {showProfileSetup && <ProfileSetup onComplete={() => {}} />}
      <Outlet />
      <BottomNav />
    </div>
  );
}

// Route definitions
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
