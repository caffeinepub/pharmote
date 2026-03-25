import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type CustomCategory = {
    #courses;
    #icSc;
    #contactSignals;
    #dataParking;
  };

  type OldNoteMetaData = {
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

  type OldUserProfile = {
    name : Text;
    bio : Text;
  };

  type OldActor = {
    notes : Map.Map<Text, OldNoteMetaData>;
    userBookmarks : Map.Map<Principal, Set.Set<Text>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewCustomCategory = {
    #bPharm;
    #dPharm;
    #mPharm;
    #graduate;
  };

  type NewNoteMetaData = {
    id : Text;
    title : Text;
    description : Text;
    category : NewCustomCategory;
    uploader : Principal;
    blob : Storage.ExternalBlob;
    timestamp : Time.Time;
    isPublic : Bool;
    isFeatured : Bool;
  };

  type NewUserProfile = {
    name : Text;
    age : Nat;
    dob : Text;
    course : NewCustomCategory;
  };

  type NewActor = {
    notes : Map.Map<Text, NewNoteMetaData>;
    userBookmarks : Map.Map<Principal, Set.Set<Text>>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newNotes = old.notes.map<Text, OldNoteMetaData, NewNoteMetaData>(
      func(_id, oldNote) {
        {
          id = oldNote.id;
          title = oldNote.title;
          description = oldNote.description;
          category = #bPharm;
          uploader = oldNote.uploader;
          blob = oldNote.blob;
          timestamp = oldNote.timestamp;
          isPublic = oldNote.isPublic;
          isFeatured = oldNote.isFeatured;
        };
      }
    );

    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          name = oldProfile.name;
          age = 18;
          dob = "not provided";
          course = #bPharm;
        };
      }
    );

    {
      notes = newNotes;
      userBookmarks = old.userBookmarks;
      userProfiles = newUserProfiles;
    };
  };
};
