const { leaveStatus, leavesType } = require("../../config/enums");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON, paginate } = require('../../utils/mongoose');
const autopopulate = require('mongoose-autopopulate');

const leaveRequestSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: {
        maxDepth: 1,
        select: {
          lastName: 1,
          firstName: 1,
          employeeId: 1,
          role: 1,
          department: 1,
          email: 1,
          leaves: 1,
          jobTitle: 1
        },
      },
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or your organization admin model
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization", autopopulate: { maxDepth: 1, select: { name: 1, logo: 1 } }
    },
    organizationData: {
      id: { type: mongoose.Types.ObjectId, ref: "Organization" },
      name: { type: String },
      logo: { type: String }
    },
    reportTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userData: {
      lastName: String,
      firstName: String,
      employeeId: String,
      role: String,
      department: String,
      email: String,
      jobTitle: String
    },
    approverData: { name: String, email: String, role: String },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leaveType: {
      type: String,
      enum: { ...Object.values(leavesType) },
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: { ...Object.values(leaveStatus) },
      default: leaveStatus.PENDING,
    },
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1, select: { "lastName": 1, "firstName": 1, } }, // the person who approved/rejected the request
    },
    reply: {
      type: String,
    },
    isHalfDay: {
      type: Boolean,
      default: false,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    totalDays: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

leaveRequestSchema.plugin(toJSON);
leaveRequestSchema.plugin(paginate);
leaveRequestSchema.plugin(autopopulate);

const Leaves = mongoose.model('leaveRequest', leaveRequestSchema);
module.exports = Leaves;