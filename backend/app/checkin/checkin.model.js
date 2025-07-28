const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { toJSON, paginate } = require('../../utils/mongoose');
const autopopulate = require('mongoose-autopopulate');
const { workStatus } = require('../../config/enums');

const checkinSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // autopopulate: { maxDepth: 1, select: { "lastName": 1, "firstName": 1, "employeeId": 1, "role": 1 } },
  },
  name: { type: String },
  email: { type: String },
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  reportsTo: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String }, // Manager's name for quick display
    email: { type: String }, // Manager's email for notifications
    // Add other frequently accessed manager fields if needed
  },
  checkin: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,

  },
  workStatus: {
    type: String,
    enums: { ...Object.values(workStatus) },
    default: workStatus.OFFICE
  },
  organizationName: String,
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', autopopulate: { maxDepth: 1, select: { name: 1 } } },
  employeeId: { type: String },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { name: String, email: String },
  active: { type: Boolean, default: true },
  data:{type:Object}
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

checkinSchema.plugin(toJSON);`1`
checkinSchema.plugin(paginate);
checkinSchema.plugin(autopopulate);
// Date-based
checkinSchema.index({ createdAt: -1 }); // For pagination (default sort)

checkinSchema.index({ user: 1 });                  // For OWN permission and direct user filters
checkinSchema.index({ admin: 1 });                 // For TEAM permission
checkinSchema.index({ organizationId: 1 });        // For ORGANIZATION permission

checkinSchema.index({ clientId: 1 });              // Optional filter
checkinSchema.index({ email: 1 });                 // Optional filter
checkinSchema.index({ "reportsTo.id": 1 });        // Nested field filter
checkinSchema.index({ workStatus: 1 });            // Optional filter

// Compound indexes based on common query patterns
checkinSchema.index({ admin: 1, createdAt: -1 });
checkinSchema.index({ user: 1, createdAt: -1 });
checkinSchema.index({ organizationId: 1, workStatus: 1, createdAt: -1 });
checkinSchema.index({ user: 1, clientId: 1, createdAt: -1 });
checkinSchema.index({ "reportsTo.id": 1, createdAt: -1 });
const Checkin = mongoose.model('Checkin', checkinSchema);
module.exports = Checkin;