import Set "mo:core/Set";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  type CustomCategory = {
    #bPharm;
    #dPharm;
    #mPharm;
    #graduate;
  };
  module CustomCategory {
    public func toText(category : CustomCategory) : Text {
      switch (category) {
        case (#bPharm) { "B. Pharm" };
        case (#dPharm) { "D. Pharm" };
        case (#mPharm) { "M. Pharm" };
        case (#graduate) { "Graduate" };
      };
    };
  };

  type NoteMetaData = {
    id : Text;
    title : Text;
    description : Text;
    category : CustomCategory;
    uploader : Principal;
    blob : Storage.ExternalBlob;
    timestamp : Time.Time;
    isPublic : Bool;
    isFeatured : Bool;
  };

  module NoteMetaData {
    public func compare(note1 : NoteMetaData, note2 : NoteMetaData) : Order.Order {
      switch (Text.compare(note1.title, note2.title)) {
        case (#equal) { Int.compare(note1.timestamp, note2.timestamp) };
        case (order) { order };
      };
    }
  };

  type UserProfile = {
    name : Text;
    age : Nat;
    dob : Text;
    course : CustomCategory;
  };

  let notes = Map.empty<Text, NoteMetaData>();
  let userBookmarks = Map.empty<Principal, Set.Set<Text>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize authorization and storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Note CRUD
  public query ({ caller }) func getNoteById(id : Text) : async ?NoteMetaData {
    switch (notes.get(id)) {
      case (null) { null };
      case (?note) {
        if (note.isPublic or note.uploader == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?note;
        } else {
          null;
        };
      };
    };
  };

  public shared ({ caller }) func createNote(note : NoteMetaData) : async () {
    // Only authenticated users can create notes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create notes");
    };

    // Only admins can create featured notes
    if (note.isFeatured and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create featured notes");
    };

    notes.add(note.id, note);
  };

  public shared ({ caller }) func updateNote(id : Text, note : NoteMetaData) : async () {
    // Only authenticated users can update notes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };

    let existingNote = switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?existingNote) { existingNote };
    };

    // Only admin can change featured status
    if (note.isFeatured != existingNote.isFeatured and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can change featured status");
    };

    // Only owner or admin can update notes
    if (existingNote.uploader != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the owner or admin can update this note");
    };

    notes.add(id, note);
  };

  public shared ({ caller }) func deleteNote(id : Text) : async Bool {
    // Only authenticated users can delete notes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };

    let note = switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) { note };
    };

    // Only owner or admin can delete notes
    if (note.uploader != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the owner or admin can delete this note");
    };

    notes.remove(id);

    // Remove from all user bookmarks
    for ((user, bookmarks) in userBookmarks.entries()) {
      if (bookmarks.contains(id)) {
        bookmarks.remove(id);
      };
    };
    true;
  };

  public shared ({ caller }) func addBookmark(noteId : Text) : async Bool {
    // Only authenticated users can add bookmarks
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add bookmarks");
    };

    switch (notes.get(noteId)) {
      case (null) { return false };
      case (?note) {
        // Can only bookmark public notes or own notes
        if (not note.isPublic and note.uploader != caller) {
          return false;
        };

        let bookmarks = switch (userBookmarks.get(caller)) {
          case (null) {
            let newBookmarks = Set.empty<Text>();
            userBookmarks.add(caller, newBookmarks);
            newBookmarks;
          };
          case (?bookmarks) { bookmarks };
        };

        if (bookmarks.contains(noteId)) { return false };
        bookmarks.add(noteId);
        true;
      };
    };
  };

  public shared ({ caller }) func removeBookmark(noteId : Text) : async Bool {
    // Only authenticated users can remove bookmarks
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove bookmarks");
    };

    let bookmarks = switch (userBookmarks.get(caller)) {
      case (null) { return false };
      case (?bookmarks) { bookmarks };
    };
    if (not bookmarks.contains(noteId)) { return false };
    bookmarks.remove(noteId);
    true;
  };

  public query ({ caller }) func getBookmarkedNotes() : async [NoteMetaData] {
    // Only authenticated users can view their bookmarks
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookmarks");
    };

    let bookmarks = switch (userBookmarks.get(caller)) {
      case (null) { return [] };
      case (?bookmarks) { bookmarks };
    };
    bookmarks.toArray().map(func(noteId) { notes.get(noteId) }).filter(func(x) { x != null }).map(func(x) { switch (x) { case (null) { Runtime.trap("Note not found") }; case (?note) { note } } });
  };

  public query func getNotesByCategory(category : CustomCategory) : async [NoteMetaData] {
    notes.values().toArray().filter(func(note) { note.category == category and note.isPublic });
  };

  public query func getFeaturedNotes() : async [NoteMetaData] {
    notes.values().toArray().filter(func(note) { note.isFeatured and note.isPublic });
  };

  public query func getRecentNotes() : async [NoteMetaData] {
    notes.values().toArray().filter(func(note) { note.isPublic });
  };

  public query ({ caller }) func getUserNotes(user : Principal) : async [NoteMetaData] {
    let isOwner = caller == user;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (isOwner or isAdmin) {
      notes.values().toArray().filter(func(note) { note.uploader == user });
    } else {
      notes.values().toArray().filter(func(note) { note.uploader == user and note.isPublic });
    };
  };

  public query func getAllNotes() : async [NoteMetaData] {
    notes.values().toArray().filter(func(note) { note.isPublic });
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Only authenticated users can save profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Only authenticated users can view their own profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can view their own profile, admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func createOrUpdateProfile(name : Text, age : Nat, dob : Text, course : CustomCategory) : async () {
    // Only authenticated users can create/update profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    if (name.size() <= 1 or name.size() > 100) {
      Runtime.trap("Name must be between 2 and 100 characters");
    };

    if (age > 150) {
      Runtime.trap("Invalid age");
    };

    let profile : UserProfile = {
      name;
      age;
      dob;
      course;
    };
    userProfiles.add(caller, profile);
  };
};
