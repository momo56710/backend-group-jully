// Import mongoose library
const mongoose = require("mongoose");

// Define Schema - blueprint for creating documents
const Schema = mongoose.Schema;

// =================================================================================
// COMPLETE USER SCHEMA WITH ALL MONGOOSE TYPES AND VALIDATORS
// =================================================================================

const userSchema = new Schema(
  {
    // ===============================
    // STRING TYPE WITH VALIDATORS
    // ===============================
    // Basic string field - most common type
    name: {
      type: String, // Data type
      required: true, // Field is mandatory
      trim: true, // Removes whitespace from beginning and end
      minlength: 2, // Minimum characters allowed
      maxlength: 50, // Maximum characters allowed
      lowercase: true, // Converts to lowercase before saving
    },

    // String with custom validation
    email: {
      type: String,
      required: [true, "Email is required"], // Custom error message
      unique: true, // No duplicates allowed in database
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          // Custom email validation using regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please enter a valid email address",
      },
    },

    // String with enum (predefined values only)
    role: {
      type: String,
      enum: ["user", "admin", "moderator"], // Only these values allowed
      default: "user", // Default value if not provided
    },

    // String with custom getter/setter
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },

    // ===============================
    // NUMBER TYPE WITH VALIDATORS
    // ===============================

    age: {
      type: Number,
      required: true,
      min: [13, "Age must be at least 13"], // Minimum value with custom message
      max: [120, "Age cannot exceed 120"], // Maximum value with custom message
      validate: {
        validator: Number.isInteger, // Must be whole number
        message: "Age must be an integer",
      },
    },

    // Decimal numbers
    salary: {
      type: Number,
      min: 0, // No negative salaries
      max: 1000000, // Maximum salary cap
      default: 0, // Default value
    },

    // ===============================
    // BOOLEAN TYPE
    // ===============================

    isActive: {
      type: Boolean,
      default: true, // Default to active user
    },

    isVerified: {
      type: Boolean,
      default: false, // Default to unverified
    },

    // ===============================
    // DATE TYPE WITH VALIDATORS
    // ===============================

    birthDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          // Must be in the past
          return date < new Date();
        },
        message: "Birth date must be in the past",
      },
    },

    // Auto-generated timestamps
    createdAt: {
      type: Date,
      default: () => Date.now, // Automatically set current date
    },

    lastLogin: {
      type: Date,
      default: () => Date.now,
    },

    // ===============================
    // OBJECTID TYPE (REFERENCES)
    // ===============================

    // Reference to another collection
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to Department model
      required: false, // Optional reference
    },

    // ===============================
    // ARRAY TYPES
    // ===============================

    // Array of strings
    hobbies: {
      type: [String], // Array of strings
      validate: {
        validator: function (hobbies) {
          return hobbies.length <= 10; // Maximum 10 hobbies
        },
        message: "Cannot have more than 10 hobbies",
      },
    },

    // Array of numbers
    scores: {
      type: [Number],
      validate: {
        validator: function (scores) {
          return scores.every((score) => score >= 0 && score <= 100);
        },
        message: "All scores must be between 0 and 100",
      },
    },

    // Array of ObjectIds (multiple references)
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Self-reference to User model
      },
    ],

    // ===============================
    // NESTED OBJECTS (SUBDOCUMENTS)
    // ===============================

    // Single nested object
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        match: [/^\d{5}$/, "Zip code must be 5 digits"],
      },
      country: {
        type: String,
        required: true,
        uppercase: true, // Convert to uppercase
      },
    },

    // Array of nested objects
    socialMedia: [
      {
        platform: {
          type: String,
          enum: ["facebook", "twitter", "instagram", "linkedin"],
          required: true,
        },
        url: {
          type: String,
          required: true,
          validate: {
            validator: function (url) {
              return /^https?:\/\/.+/.test(url);
            },
            message: "URL must start with http:// or https://",
          },
        },
        isPublic: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // ===============================
    // MIXED TYPE (ANY DATA TYPE)
    // ===============================

    // Can store any type of data
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ===============================
    // BUFFER TYPE (FOR BINARY DATA)
    // ===============================

    // For storing binary data like images
    profilePicture: {
      type: Buffer,
    },

    // ===============================
    // MAP TYPE (KEY-VALUE PAIRS)
    // ===============================

    // Map of string keys to string values
    settings: {
      type: Map,
      of: String, // Values must be strings
      default: new Map(),
    },

    // ===============================
    // DECIMAL128 TYPE (HIGH PRECISION NUMBERS)
    // ===============================

    // For financial calculations requiring high precision
    accountBalance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Account balance cannot be negative",
      },
    },
  },
  {
    // ===============================
    // SCHEMA OPTIONS
    // ===============================

    timestamps: true, // Automatically add createdAt and updatedAt fields

    // Add version key (__v) for optimistic concurrency
    versionKey: "__v",

    // Transform output when converting to JSON
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v; // Remove version key from JSON output
        return ret;
      },
    },

    // Transform output when converting to Object
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v; // Remove version key from object output
        return ret;
      },
    },
  }
);

// =================================================================================
// SCHEMA METHODS (INSTANCE METHODS)
// =================================================================================

// Method to get full name (if you had firstName and lastName)
userSchema.methods.getFullInfo = function () {
  return `${this.name} (${this.email}) - Role: ${this.role}`;
};

// Method to check if user is adult
userSchema.methods.isAdult = function () {
  return this.age >= 18;
};

// =================================================================================
// SCHEMA STATICS (MODEL METHODS)
// =================================================================================

// Static method to find users by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role: role });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

// =================================================================================
// MIDDLEWARE (HOOKS)
// =================================================================================

// Pre-save middleware (runs before saving)
userSchema.pre("save", function (next) {
  // 'this' refers to the document being saved
  console.log("About to save user:", this.name);

  // You can modify the document here
  if (this.isModified("email")) {
    console.log("Email was modified");
  }

  next(); // Continue with save
});

// Post-save middleware (runs after saving)
userSchema.post("save", function (doc) {
  console.log("User saved successfully:", doc.name);
});

// Pre-remove middleware
userSchema.pre("remove", function (next) {
  console.log("About to remove user:", this.name);
  next();
});

// =================================================================================
// VIRTUAL PROPERTIES (NOT STORED IN DATABASE)
// =================================================================================

// Virtual property to calculate age from birthDate
userSchema.virtual("calculatedAge").get(function () {
  if (this.birthDate) {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  return null;
});

// Virtual property for full address
userSchema.virtual("fullAddress").get(function () {
  if (this.address) {
    return `${this.address.street}, ${this.address.city}, ${this.address.zipCode}, ${this.address.country}`;
  }
  return "No address provided";
});

// =================================================================================
// INDEXES FOR BETTER QUERY PERFORMANCE
// =================================================================================

// Single field index
userSchema.index({ email: 1 }); // 1 for ascending, -1 for descending

// Compound index (multiple fields)
userSchema.index({ role: 1, isActive: 1 });

// Text index for search functionality
userSchema.index({ name: "text", email: "text" });

// =================================================================================
// CREATE AND EXPORT MODEL
// =================================================================================

// Create model from schema
const User = mongoose.model("User", userSchema);

// Export model for use in other files
module.exports = User;

// =================================================================================
// EXAMPLE USAGE (COMMENTED OUT)
// =================================================================================

/*
// Example of creating a new user
const newUser = new User({
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  age: 25,
  birthDate: new Date('1998-05-15'),
  role: 'user',
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
    country: 'USA'
  },
  hobbies: ['reading', 'gaming', 'cooking'],
  socialMedia: [{
    platform: 'twitter',
    url: 'https://twitter.com/johndoe',
    isPublic: true
  }]
});

// Save the user
newUser.save()
  .then(user => console.log('User created:', user))
  .catch(error => console.error('Error creating user:', error));

// Example queries
User.findByRole('admin').then(admins => console.log('Admins:', admins));
User.findActiveUsers().then(users => console.log('Active users:', users));
*/

// =================================================================================
// ADDITIONAL SCHEMA EXAMPLE - PRODUCT SCHEMA
// =================================================================================

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: function (value) {
        return Number(value.toFixed(2)) === value;
      },
      message: "Price can have maximum 2 decimal places",
    },
  },

  category: {
    type: String,
    enum: {
      values: ["electronics", "clothing", "books", "food", "toys"],
      message:
        "Category must be one of: electronics, clothing, books, food, toys",
    },
    required: true,
  },

  inStock: {
    type: Boolean,
    default: true,
  },

  tags: {
    type: [String],
    validate: {
      validator: function (tags) {
        return tags.length <= 5;
      },
      message: "Cannot have more than 5 tags",
    },
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

// Export both models
module.exports = { User, Product };
