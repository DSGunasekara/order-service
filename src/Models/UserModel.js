import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address:{
    type: String,
    required: true,
  }
});

let User = mongoose.model("User", UserSchema);

export default User;