import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NoteMetaData, UserProfile } from "../backend";
import { CustomCategory } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["allNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["featuredNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecentNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["recentNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotesByCategory(category: CustomCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["notesByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getNotesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetNoteById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData | null>({
    queryKey: ["note", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNoteById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetBookmarkedNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["bookmarkedNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookmarkedNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserNotes(user: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<NoteMetaData[]>({
    queryKey: ["userNotes", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getUserNotes(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: NoteMetaData) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createNote(note);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNotes"] });
      qc.invalidateQueries({ queryKey: ["recentNotes"] });
      qc.invalidateQueries({ queryKey: ["featuredNotes"] });
      qc.invalidateQueries({ queryKey: ["userNotes"] });
    },
  });
}

export function useAddBookmark() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addBookmark(noteId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarkedNotes"] }),
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeBookmark(noteId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarkedNotes"] }),
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      age,
      dob,
      course,
    }: {
      name: string;
      age: bigint;
      dob: string;
      course: CustomCategory;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createOrUpdateProfile(name, age, dob, course);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allNotes"] });
      qc.invalidateQueries({ queryKey: ["userNotes"] });
    },
  });
}

export const CATEGORY_LABELS: Record<CustomCategory, string> = {
  [CustomCategory.bPharm]: "B Pharm",
  [CustomCategory.dPharm]: "D Pharm",
  [CustomCategory.mPharm]: "M Pharm",
  [CustomCategory.graduate]: "Competitive Notes",
};

export const ALL_CATEGORIES = Object.values(CustomCategory);
