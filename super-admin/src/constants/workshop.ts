// Workshop Management Constants
// All strings must be constants - no magic strings allowed

// Workshop Status Options
export const WORKSHOP_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const

export const WORKSHOP_STATUS_LABELS = {
  [WORKSHOP_STATUS.DRAFT]: 'Draft',
  [WORKSHOP_STATUS.COMPLETED]: 'Completed',
  [WORKSHOP_STATUS.ARCHIVED]: 'Archived',
} as const

// Workshop Form Labels
export const WORKSHOP_FORM_LABELS = {
  // Basic Information
  TITLE: 'Workshop Title',
  SUBTITLE: 'Subtitle (Optional)',
  OVERVIEW: 'Short Overview',
  DURATION: 'Duration',
  TARGET_AUDIENCE: 'Target Audience',

  // Time & Status
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  STATUS: 'Status',

  // Content Modules
  HIGHLIGHTS: 'Workshop Highlights',
  SYLLABUS: 'Workshop Syllabus',
  MATERIALS: 'Materials',
  ASSESSMENT: 'Assessment',
  LEARNING_OUTCOMES: 'Learning Outcomes',

  // Media Assets
  VIDEO: 'Video',
  PHOTOS: 'Photos',

  // SEO Settings
  SEO_TITLE: 'SEO Title',
  SEO_DESCRIPTION: 'SEO Description',
  SOURCE: 'Source',

  // Materials Categories
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  ONLINE_RESOURCES: 'Online Resources',

  // Assessment Fields
  ASSESSMENT_ITEM: 'Assessment Item',
  ASSESSMENT_WEIGHT: 'Weight',
  ASSESSMENT_CRITERIA: 'Criteria',

  // Media Fields
  VIDEO_URL: 'Video URL',
  VIDEO_POSTER: 'Video Poster',
  VIDEO_CAPTION: 'Video Caption',
  PHOTO_URL: 'Photo URL',
  PHOTO_ALT: 'Photo Alt Text',
} as const

// Workshop Form Placeholders
export const WORKSHOP_FORM_PLACEHOLDERS = {
  TITLE: 'Enter workshop title',
  SUBTITLE: 'Enter subtitle (optional)',
  OVERVIEW: 'Brief description of the workshop',
  DURATION: 'e.g., 2 days (9:30-12:00, 13:30-16:00 each day)',
  TARGET_AUDIENCE: 'e.g., Middle to high school students (ages 12-18)',
  START_DATE: 'Select start date',
  END_DATE: 'Select end date',
  HIGHLIGHT: 'Enter workshop highlight',
  SYLLABUS_DAY_TITLE: 'Enter day title',
  SYLLABUS_OBJECTIVE: 'Enter learning objective',
  SYLLABUS_ACTIVITY: 'Enter activity description',
  HARDWARE_ITEM: 'Enter hardware item',
  SOFTWARE_ITEM: 'Enter software item',
  ONLINE_RESOURCE: 'Enter online resource',
  ASSESSMENT_ITEM: 'Enter assessment item name',
  ASSESSMENT_WEIGHT: 'e.g., 60%',
  ASSESSMENT_CRITERIA: 'Enter assessment criteria',
  LEARNING_OUTCOME: 'Enter learning outcome',
  VIDEO_URL: 'Enter video URL',
  VIDEO_POSTER: 'Enter video poster URL',
  VIDEO_CAPTION: 'Enter video caption',
  PHOTO_URL: 'Enter photo URL',
  PHOTO_ALT: 'Enter photo alt text',
  SEO_TITLE: 'Enter SEO title',
  SEO_DESCRIPTION: 'Enter SEO description',
  SOURCE: 'Enter source information',
} as const

// Workshop Form Validation Messages
export const WORKSHOP_VALIDATION_MESSAGES = {
  // Required Field Messages
  TITLE_REQUIRED: 'Workshop title is required',
  OVERVIEW_REQUIRED: 'Workshop overview is required',
  DURATION_REQUIRED: 'Duration is required',
  TARGET_AUDIENCE_REQUIRED: 'Target audience is required',
  START_DATE_REQUIRED: 'Start date is required',
  END_DATE_REQUIRED: 'End date is required',
  STATUS_REQUIRED: 'Status is required',
  HIGHLIGHTS_REQUIRED: 'At least one highlight is required',
  SYLLABUS_REQUIRED: 'At least one syllabus day is required',
  MATERIALS_REQUIRED: 'Materials are required',
  ASSESSMENT_REQUIRED: 'At least one assessment item is required',
  LEARNING_OUTCOMES_REQUIRED: 'At least one learning outcome is required',
  VIDEO_REQUIRED: 'Video is required',
  PHOTOS_REQUIRED: 'At least one photo is required',
  SEO_TITLE_REQUIRED: 'SEO title is required',
  SEO_DESCRIPTION_REQUIRED: 'SEO description is required',
  SOURCE_REQUIRED: 'Source is required',


  // Date Validation Messages
  END_DATE_BEFORE_START: 'End date must be after start date',
  INVALID_DATE_FORMAT: 'Please enter a valid date',

  // Array Validation Messages
  HIGHLIGHTS_MIN_ITEMS: 'At least 1 highlight is required',
  HIGHLIGHTS_MAX_ITEMS: 'Maximum 10 highlights allowed',
  SYLLABUS_MIN_DAYS: 'At least 1 syllabus day is required',
  SYLLABUS_MAX_DAYS: 'Maximum 30 days allowed',
  MATERIALS_MIN_ITEMS: 'At least 1 item required for each material category',
  MATERIALS_MAX_ITEMS: 'Maximum 20 items allowed per category',
  ASSESSMENT_MIN_ITEMS: 'At least 1 assessment item is required',
  ASSESSMENT_MAX_ITEMS: 'Maximum 10 assessment items allowed',
  LEARNING_OUTCOMES_MIN_ITEMS: 'At least 1 learning outcome is required',
  LEARNING_OUTCOMES_MAX_ITEMS: 'Maximum 15 learning outcomes allowed',
  PHOTOS_MIN_ITEMS: 'At least 1 photo is required',
  PHOTOS_MAX_ITEMS: 'Maximum 20 photos allowed',

  // URL Validation Messages
  INVALID_VIDEO_URL: 'Please enter a valid video URL',
  INVALID_PHOTO_URL: 'Please enter a valid photo URL',
  INVALID_VIDEO_POSTER_URL: 'Please enter a valid video poster URL',

  // General Validation Messages
  INVALID_FORMAT: 'Invalid format',
  FIELD_TOO_SHORT: 'Field is too short',
  FIELD_TOO_LONG: 'Field is too long',
} as const

// Workshop Form Success Messages
export const WORKSHOP_SUCCESS_MESSAGES = {
  WORKSHOP_CREATED: 'Workshop created successfully!',
  WORKSHOP_UPDATED: 'Workshop updated successfully!',
  WORKSHOP_DELETED: 'Workshop deleted successfully!',
  WORKSHOP_ARCHIVED: 'Workshop archived successfully!',
  WORKSHOP_RESTORED: 'Workshop restored successfully!',
  FORM_SAVED: 'Form saved successfully!',
  MEDIA_UPLOADED: 'Media uploaded successfully!',
} as const

// Workshop Form Error Messages
export const WORKSHOP_ERROR_MESSAGES = {
  WORKSHOP_CREATE_FAILED: 'Failed to create workshop. Please try again.',
  WORKSHOP_UPDATE_FAILED: 'Failed to update workshop. Please try again.',
  WORKSHOP_DELETE_FAILED: 'Failed to delete workshop. Please try again.',
  WORKSHOP_LOAD_FAILED: 'Failed to load workshop. Please try again.',
  WORKSHOPS_LOAD_FAILED: 'Failed to load workshops. Please try again.',
  FORM_SAVE_FAILED: 'Failed to save form. Please try again.',
  MEDIA_UPLOAD_FAILED: 'Failed to upload media. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please correct the errors below.',
} as const

// Workshop Validation Rules
export const WORKSHOP_VALIDATION_RULES = {
  TITLE: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  OVERVIEW: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  DURATION: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  TARGET_AUDIENCE: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  START_DATE: {
    required: true,
    type: 'date' as const,
  },
  END_DATE: {
    required: true,
    type: 'date' as const,
    after: 'startDate' as const,
  },
  STATUS: {
    required: true,
    enum: Object.values(WORKSHOP_STATUS),
  },
  HIGHLIGHTS: {
    required: true,
    minItems: 1,
    maxItems: 10,
  },
  SYLLABUS: {
    required: true,
    minItems: 1,
    maxItems: 30,
  },
  MATERIALS: {
    HARDWARE: {
      required: true,
      minItems: 1,
      maxItems: 20,
    },
    SOFTWARE: {
      required: true,
      minItems: 1,
      maxItems: 20,
    },
    ONLINE_RESOURCES: {
      required: true,
      minItems: 1,
      maxItems: 20,
    },
  },
  ASSESSMENT: {
    required: true,
    minItems: 1,
    maxItems: 10,
  },
  LEARNING_OUTCOMES: {
    required: true,
    minItems: 1,
    maxItems: 15,
  },
  MEDIA: {
    VIDEO: {
      required: true,
      type: 'object' as const,
    },
    PHOTOS: {
      required: true,
      minItems: 1,
      maxItems: 20,
    },
  },
  SEO: {
    TITLE: {
      required: true,
      minLength: 10,
      maxLength: 60,
    },
    DESCRIPTION: {
      required: true,
      minLength: 20,
      maxLength: 160,
    },
  },
  SOURCE: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
} as const

// Workshop Form Actions
export const WORKSHOP_FORM_ACTIONS = {
  ADD_HIGHLIGHT: 'Add Highlight',
  REMOVE_HIGHLIGHT: 'Remove Highlight',
  ADD_SYLLABUS_DAY: 'Add Syllabus Day',
  REMOVE_SYLLABUS_DAY: 'Remove Syllabus Day',
  ADD_ACTIVITY: 'Add Activity',
  REMOVE_ACTIVITY: 'Remove Activity',
  ADD_HARDWARE: 'Add Hardware Item',
  REMOVE_HARDWARE: 'Remove Hardware Item',
  ADD_SOFTWARE: 'Add Software Item',
  REMOVE_SOFTWARE: 'Remove Software Item',
  ADD_ONLINE_RESOURCE: 'Add Online Resource',
  REMOVE_ONLINE_RESOURCE: 'Remove Online Resource',
  ADD_ASSESSMENT: 'Add Assessment Item',
  REMOVE_ASSESSMENT: 'Remove Assessment Item',
  ADD_LEARNING_OUTCOME: 'Add Learning Outcome',
  REMOVE_LEARNING_OUTCOME: 'Remove Learning Outcome',
  ADD_PHOTO: 'Add Photo',
  REMOVE_PHOTO: 'Remove Photo',
  UPLOAD_VIDEO: 'Upload Video',
  UPLOAD_PHOTO: 'Upload Photo',
  SAVE_DRAFT: 'Save as Draft',
  SAVE_AND_PUBLISH: 'Save and Publish',
  CANCEL: 'Cancel',
  PREVIEW: 'Preview',
} as const

// Workshop Table Headers
export const WORKSHOP_TABLE_HEADERS = {
  TITLE: 'Title',
  STATUS: 'Status',
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  TARGET_AUDIENCE: 'Target Audience',
  DURATION: 'Duration',
  CREATED_AT: 'Created',
  UPDATED_AT: 'Updated',
  ACTIONS: 'Actions',
} as const

// Workshop Filter Options
export const WORKSHOP_FILTER_OPTIONS = {
  STATUS_ALL: 'All Status',
  STATUS_DRAFT: 'Draft',
  STATUS_COMPLETED: 'Completed',
  STATUS_ARCHIVED: 'Archived',
  SORT_BY_TITLE: 'Title',
  SORT_BY_START_DATE: 'Start Date',
  SORT_BY_END_DATE: 'End Date',
  SORT_BY_CREATED_AT: 'Created Date',
  SORT_ORDER_ASC: 'Ascending',
  SORT_ORDER_DESC: 'Descending',
} as const

// Workshop Action Buttons
export const WORKSHOP_ACTION_BUTTONS = {
  CREATE_NEW: 'Create New Workshop',
  EDIT: 'Edit',
  DELETE: 'Delete',
  ARCHIVE: 'Archive',
  RESTORE: 'Restore',
  PREVIEW: 'Preview',
  DUPLICATE: 'Duplicate',
  EXPORT: 'Export',
} as const

// Workshop Form Sections
export const WORKSHOP_FORM_SECTIONS = {
  BASIC_INFO: 'Basic Information',
  TIME_STATUS: 'Time & Status',
  CONTENT_MODULES: 'Content Modules',
  MEDIA_ASSETS: 'Media Assets',
  SEO_SETTINGS: 'SEO Settings',
} as const

// Export all constants
export const WORKSHOP_CONSTANTS = {
  STATUS: WORKSHOP_STATUS,
  STATUS_LABELS: WORKSHOP_STATUS_LABELS,
  FORM_LABELS: WORKSHOP_FORM_LABELS,
  FORM_PLACEHOLDERS: WORKSHOP_FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES: WORKSHOP_VALIDATION_MESSAGES,
  SUCCESS_MESSAGES: WORKSHOP_SUCCESS_MESSAGES,
  ERROR_MESSAGES: WORKSHOP_ERROR_MESSAGES,
  VALIDATION_RULES: WORKSHOP_VALIDATION_RULES,
  FORM_ACTIONS: WORKSHOP_FORM_ACTIONS,
  TABLE_HEADERS: WORKSHOP_TABLE_HEADERS,
  FILTER_OPTIONS: WORKSHOP_FILTER_OPTIONS,
  ACTION_BUTTONS: WORKSHOP_ACTION_BUTTONS,
  FORM_SECTIONS: WORKSHOP_FORM_SECTIONS,
} as const
