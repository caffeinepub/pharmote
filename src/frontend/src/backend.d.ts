import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface NoteMetaData {
    id: string;
    title: string;
    blob: ExternalBlob;
    description: string;
    isFeatured: boolean;
    timestamp: Time;
    category: CustomCategory;
    uploader: Principal;
    isPublic: boolean;
}
export interface UserProfile {
    age: bigint;
    dob: string;
    name: string;
    course: CustomCategory;
}
export enum CustomCategory {
    graduate = "graduate",
    dPharm = "dPharm",
    bPharm = "bPharm",
    mPharm = "mPharm"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBookmark(noteId: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNote(note: NoteMetaData): Promise<void>;
    createOrUpdateProfile(name: string, age: bigint, dob: string, course: CustomCategory): Promise<void>;
    deleteNote(id: string): Promise<boolean>;
    getAllNotes(): Promise<Array<NoteMetaData>>;
    getBookmarkedNotes(): Promise<Array<NoteMetaData>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedNotes(): Promise<Array<NoteMetaData>>;
    getNoteById(id: string): Promise<NoteMetaData | null>;
    getNotesByCategory(category: CustomCategory): Promise<Array<NoteMetaData>>;
    getRecentNotes(): Promise<Array<NoteMetaData>>;
    getUserNotes(user: Principal): Promise<Array<NoteMetaData>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeBookmark(noteId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateNote(id: string, note: NoteMetaData): Promise<void>;
}
