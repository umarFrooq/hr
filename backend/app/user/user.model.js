const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON, paginate } = require("../../utils/mongoose");
const { roleTypes, countries } = require("../../config/enums");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { leaveSchema } = require("../organization/organization.model");
const autopopulate = require("mongoose-autopopulate");
const { RestoreObjectRequestFilterSensitiveLog } = require("@aws-sdk/client-s3");
const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  relationship: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
})
const address = new Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: countries.PAK, enums: { ...Object.values(countries) } },
  zipCode: { type: String },

})
const userSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('USER_MODULE.INVALID_EMAIL');
        }
      }
    },
    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('USER_MODULE.INVALID_MOBILE_NO');
        }
      },

    },
    dateOfBirth: {
      type: Date,
    },

    bio: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'USER_MODULE.PASSWORD_MUST_BE_ALPHANUMERIC'
          );
        }
      },
      // select: false, // used by the toJSON plugin
    },
    role: { type: String, default: roleTypes.EMPLOYEE, },
    rolePermission: { type: mongoose.Types.ObjectId, ref: 'Role', autopopulate: { maxDepth: 2 } },
    isActive: {
      type: Boolean,
      default: true,
    },
    documents: [{ name: { type: String }, url: { type: String } }],
    organization: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
      name: { type: String }, // Manager's name for quick display


    },
    reportsTo: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String }, // Manager's name for quick display
      email: { type: String }, // Manager's email for notifications
      // Add other frequently accessed manager fields if needed
    },
    reportingHierarchy: [{
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    address: address,
    emergencyContact: emergencyContactSchema,
    leaves: leaveSchema,
    admin: { type: mongoose.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Types.ObjectId, ref: "User" },
    policies: [],
    salary:{type:Number,default:0},
    advanceSalaries:{type: [Number],default:[]},
    deductions: { type: [Number], default: [] },
    totalSalary:{type:Number,default:0},
    remaingLeaves:{type:Number,default:0}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  },
)
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId, role) {

  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};


userSchema.statics.isEmailTakenWithRole = async function (email, role) {

  const user = await this.findOne({ email, role });
  return !!user;
};

userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPhoneTakenWithRole = async function (phone, role) {
  const user = await this.findOne({ phone, role });
  return !!user;
};
userSchema.statics.atlasSearch = async function (filter = {}, options = {}, search = {}) {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  // Build compound search query
  const compoundQuery = {
    must: [],
    filter: [],
    should: [],
    mustNot: []
  };

  // Add text search if search parameters exist
  if (search && (search.value || search.name)) {
    const searchValue = search.value || search.name;
    compoundQuery.must.push({
      text: {
        query: searchValue,
        path: ["firstName", "lastName"],
        fuzzy: {
          maxEdits: 2,
          prefixLength: 1
        }
      }
    });

    // Add autocomplete support for name fields
    compoundQuery.should.push({
      autocomplete: {
        query: searchValue,
        path: "firstName"
      }
    });

    compoundQuery.should.push({
      autocomplete: {
        query: searchValue,
        path: "lastName"
      }
    });
  }

  // Add filters to compound query
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle different filter types
      if (key === 'isActive') {
        compoundQuery.filter.push({
          equals: {
            path: key,
            value: Boolean(value)
          }
        });
      }


      else if (key === 'role' || key === 'department' || key === 'employeeId') {
        compoundQuery.filter.push({
          text: {
            path: key,
            query: value
          }
        });
      } else if (key === 'email' || key === 'phone') {
        compoundQuery.filter.push({
          text: {
            query: value,
            path: key
          }
        });
      } else if (key === 'organization.id' || key === 'reportsTo.id' || key === 'admin' || key === '_id') {
        compoundQuery.filter.push({
          equals: {
            path: key,
            value: value
          }
        });
      } else if (key === 'to' || key === 'from') {
        // Handle date range filters
        if (key === 'from') {
          compoundQuery.filter.push({
            range: {
              path: 'createdAt',
              gte: new Date(value)
            }
          });
        } else if (key === 'to') {
          compoundQuery.filter.push({
            range: {
              path: 'createdAt',
              lte: new Date(value)
            }
          });
        }
      } else {
        // Default text search for other fields
        compoundQuery.filter.push({
          text: {
            query: value,
            path: key
          }
        });
      }
    }
  });

  // Handle sorting
  let sortStage = {};
  if (options.sortBy) {
    const sortParts = options.sortBy.split(':');
    const sortField = sortParts[0];
    const sortOrder = sortParts[1] === 'desc' ? -1 : 1;
    sortStage[sortField] = sortOrder;
  } else {
    sortStage.createdAt = -1;
  }


  // Build the aggregation pipeline
  const pipeline = [];

  // Only add search stage if there are filters or search terms
  const hasFilters = Object.keys(filter).length > 0;
  const hasSearch = search && (search.value || search.name);

  if (hasFilters || hasSearch) {
    pipeline.push({
      $search: {
        index: "userNameSearch", // Your Atlas Search index name
        compound: compoundQuery
      }
    });

    // Add search score if text search is performed
    if (hasSearch) {
      pipeline.push({
        $addFields: {
          score: { $meta: "searchScore" }
        }
      });
    }
  }
  pipeline.push(
    {
      $addFields:
      {
        id: "$_id"
      }
    },
  )
  // Add lookup for organization data if needed
  pipeline.push({
    $lookup: {
      from: "organizations",
      localField: "organization.id",
      foreignField: "_id",
      pipeline: [{
        $addFields: {
          id: "$_id"
        }
      }],
      as: "organizationData"
    }
  });

  pipeline.push({
    $addFields: {
      organizationData: { $arrayElemAt: ["$organizationData", 0] }
    }
  });

  // Sort results
  pipeline.push({
    $sort: sortStage
  });

  // Facet for pagination and count
  pipeline.push({
    $facet: {
      docs: [
        { $skip: skip },
        { $limit: limit }
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  });// Add search score if text search is performed
  (search && (search.value || search.name) ? [{
    $addFields: {
      score: { $meta: "searchScore" }
    }
  }] : []),
  // Add lookup for organization data if needed
  {
    $lookup: {
      from: "organizations",
      localField: "organization.id",
      foreignField: "_id",
      as: "organizationData"
    }
  },
  {
    $addFields: {
      organizationData: { $arrayElemAt: ["$organizationData", 0] }
    }
  },
  // Sort results
  {
    $sort: sortStage
  },
  // Facet for pagination and count
  {
    $facet: {
      docs: [
        { $skip: skip },
        { $limit: limit }
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  }
  // ];
  console.log(JSON.stringify(pipeline));

  const result = await this.aggregate(pipeline);
  const results = result[0].docs;
  const totalResults = result[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    totalResults: totalResults,
    limit,
    page,
    totalPages,

  };
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
if (user.isNew) {
  user.totalSalary = user.salary;

  if (user.leaves && typeof user.leaves === 'object' && Object.keys(user.leaves).length > 0 && user.leaves.total) {
    user.remaingLeaves = user.leaves.total;
  }
}

if (
  user.leaves &&
  typeof user.leaves === 'object' &&
  Object.keys(user.leaves).length > 0 &&
  user.leaves.total &&
  (!user.remaingLeaves || user.remaingLeaves === 0)
) {
  user.remaingLeaves = user.leaves.total;
}

  next();
});

// Update user password before updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const update = this.getUpdate();
  try {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual("organizationData", {
  ref: "Organization",
  localField: "organization.id",       // this is the User _id
  foreignField: "_id",    // this is the field in Organization that refers to User
  justOne: true,           // true since each user has one organization
  autopopulate: { maxDepth: 1, name: 1, id: 1, leaves: 1 },
});
userSchema.plugin(autopopulate);
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Create a model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = { User, address };

