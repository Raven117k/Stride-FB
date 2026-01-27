import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
}, { _id: false });

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snacks"],
    required: true,
  },

  time: String,

  foods: [foodSchema],
  image: String,

}, { timestamps: true });

/* 🔥 AUTO TOTALS (virtuals) */
mealSchema.virtual("totals").get(function () {
  return this.foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fats += food.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
});

mealSchema.set("toJSON", { virtuals: true });
mealSchema.set("toObject", { virtuals: true });

export default mongoose.model("Meal", mealSchema);
