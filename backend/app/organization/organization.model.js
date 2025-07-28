const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON, paginate } = require("../../utils/mongoose");
const { roleTypes, countries, organizationTypes } = require("../../config/enums");
const autopopulate = require("mongoose-autopopulate");
const leaveSchema = new Schema({
  casual: { type: Number },
  sick: { type: Number },
  annual: { type: Number },
  maternity: { type: Number },
  paternity: { type: Number },
  unpaid: { type: Number, default: 0 },
  other: { type: Number },
  total: { type: Number },
  expiryDate: { type: Date },
})
const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: { maxDepth: 1, select: { "lastName": 1, "firstName": 1 } },

  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: countries.PAK, enums: { ...Object.values(countries) } },
  zipCode: { type: String },
  leaves: leaveSchema,
  policies: [{
    name: String,
    description: String

  }],
  clientId: { type: mongoose.Types.ObjectId, ref: "User" },
  orgType: {
    type: String,
    default: organizationTypes.MAIN,
    trim: true,
    enums: { ...Object.values(organizationTypes) }
  },
  logo: { type: String },
  main: { type: mongoose.Types.ObjectId, ref: "Organization" }

})
organizationSchema.plugin(autopopulate);
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);
organizationSchema.statics.atlasSearch = async function (filter = {}, options = {}, search = {}) {
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
        path: ["name"],
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
        path: "name"
      }
    });

  }

  // Add filters to compound query
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle different filter types
      // if (key === 'isActive') {
      //   compoundQuery.filter.push({
      //     equals: {
      //       path: key,
      //       value: Boolean(value)
      //     }
      //   });
      // }


      if (key === 'orgType') {
        compoundQuery.filter.push({
          text: {
            path: key,
            query: value
          }
        });
      } else if (key === 'user' || key === 'clientId' || key === 'main') {
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
        index: "organizationSearch", // Your Atlas Search index name
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
// Create a model
const Orginazation = mongoose.model("Organization", organizationSchema);

module.exports = { Orginazation, leaveSchema }