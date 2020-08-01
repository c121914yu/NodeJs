const mongoose = require("mongoose");

const MscampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "请填写培训课程的名字"],
      unique: true,
      trim: true,
      maxLength: [50, "课程名字不能超过50个字"],
    },
    description: {
      type: String,
      required: [true, "请填写培训的课程描述"],
      maxlength: [500, "课程描述不能超过500个字"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "请填写合法的网址",
      ],
    },
    phone: {
      type: String,
      match: [/^[1][3,4,5,7,8][0-9]{9}$/, "请填写正确的手机号码"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "请填写正确的邮箱地址",
      ],
    },
    address: {
      type: String,
      default: "四川省成都市武侯区来福士T2办公区7层",
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "前端开发",
        "小程序开发",
        "后端开发",
        "跨平台开发",
        "数据分析",
        "数据挖掘",
        "人工智能",
      ],
    },
    online: {
      type: Boolean,
      default: true,
    },
    averageCost: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 配置virtual
MscampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "mscamp",
  justOne: false,
});

// 配置前置钩子
MscampSchema.pre("remove", async function (next) {
  // console.log(this._id, this.model("Course"));
  await this.model("Course").deleteMany({ mscamp: this._id });
  next();
});

module.exports = mongoose.model("Mscamp", MscampSchema);
