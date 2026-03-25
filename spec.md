# Pharmote

## Current State
Pharmote is a pharmacy notes sharing app with:
- Internet Identity auth + ProfileSetup (name, bio only)
- Categories: courses, icSc, contactSignals, dataParking (wrong/generic names)
- Home with featured/recent notes, search, category filters
- Upload PDFs with title, description, category
- Library (bookmarks), NoteDetail PDF viewer, Profile page
- Bottom navigation: Home, Upload, Library, Profile

## Requested Changes (Diff)

### Add
- Profile fields: age (number), date of birth, course (B Pharm / D Pharm / M Pharm / Graduate)
- Course selector in profile setup modal with 4 options
- Display course badge on profile page

### Modify
- Backend CustomCategory: rename to bPharm, dPharm, mPharm, graduate
- Backend UserProfile: extend with age (Nat), dob (Text), course (CustomCategory)
- ProfileSetup component: add age input, DOB date picker, course selector (required fields)
- Home category filters: show B Pharm, D Pharm, M Pharm, Graduate labels
- Upload page category selector: show correct pharmacy course labels
- Auth page: simplify copy to feel less technical

### Remove
- Bio field from profile setup (replaced by age/dob/course)
- Generic category names

## Implementation Plan
1. Regenerate Motoko backend with new CustomCategory variants and extended UserProfile
2. Update frontend ProfileSetup to collect name, age, DOB, course
3. Update Home FILTERS to use new category keys and labels
4. Update Upload category options
5. Update Profile page to show course, age, DOB
6. Update CATEGORY_LABELS mapping in useQueries
