const mongoose = require("mongoose");
const express = require("express");
const validator = require("validator");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3010;
app.use(cors());
app.use(express.json());



mongoose
  .connect("mongodb://localhost:27017/anshu2")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // this exclude extra spaces
    minlength: [3, "Minimum 3 letter required"],
    maxlength: 30,
  },
  email: {
    type: String,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Not a valid email.");
      }
    },
  },
  work: String,
  game: String,
  date: {
    type: Date,
    default: Date.now,
  },
  number: {
    type: Number,
    validate(val) {
      if (val < 20) {
        throw new Error("less than 20");
      }
    },
  },
});

const List = new mongoose.model("List", listSchema);

const createList = async () => {
  try {
    const list1 = new List({
      name: "Aniket",
      work: "dev",
      game: "badminton",
      number: 30,
      email: "anshu@gmail.com",
    });
    // const list2 = new List({
    //   name: "Sa",
    //   work: "dev",
    //   game: "badminton",
    //   number: 23,
    // });
    // const list3 = new List({
    //   name: "Satish",
    //   work: "dev",
    //   game: "badminton",
    //   number: 40,
    // });

    const result = await List.insertMany([list1]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// createList();

const getList = async () => {
  try {
    const result = await List
      // .find({name:{$in:["anshu","ankit"]},number:{$gt:21}})
      // .find({$or:[{name:"anshu"},{number:{$gt:21}}]})
      .find({ $and: [{ name: "anshu" }, { number: { $gt: 21 } }] })
      .select({ name: 1, _id: 0, number: 1 })
      // .countDocuments()
      // .sort({number:-1})
      .sort({ number: 1 })
      .limit(2);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
// getList();

const updateList = async (id) => {
  try {
    //    const result = await List.updateOne({_id:id},{
    //        $set : {
    //            name: "ankit"
    //        }
    //    })
    const result = await List.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: "ankit bhaia",
        },
      },
      {
        new: true,
      }
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// updateList("619fdb7df7b63824f13d80fb");

const deleteList = async (_id) => {
  try {
    // const result= await List.deleteOne({_id});
    // console.log(result)
    const result = await List.findByIdAndDelete({ _id });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// deleteList("619fd2a50bc0481b03b17679");

app.post("/api/create", async (req, res) => {
  console.log(req.body);
  try {
    const list1 = new List({
      name: req.body.name,
      work: req.body.work,
      game: req.body.game,
      number: req.body.number,
      email: req.body.email,
      date: req.body.date
    });
     const result = await List.insertMany([list1]);
     console.log(result);
    res.json({ status: 200 ,
  result: result});
  } catch (err) {
     res.json({ status: 400 });
    console.log(err);
  }
});
app.get("/api/find/:id", async (req, res) => {
  try{
    const _id=req.params.id
    const result = await List.findById({_id:_id})
    res.json({ status:200 ,
    result: result});
  }catch(err){
    res.json({ status:400 });
    console.log(err)
  }
  
});
app.patch("/api/update/:id", async (req, res) => {
  try{
    const _id=req.params.id
    const result = await List.findByIdAndUpdate({_id:_id},req.body,{
      new:true
    })
    res.json({ status: 200 ,
    result: result});
  }catch(err){
    res.json({ status:500 });
    console.log(err)
  }
  
});
app.delete("/api/delete/:id", async (req, res) => {
  try{
    const _id=req.params.id
    var result={}
    if (_id=="*"){
      result = await List.deleteMany({})
    }else{
     result = await List.findByIdAndDelete({ _id: _id });
    }
    res.json({ status: 200 ,
    result: result});
  }catch(err){
    res.json({ status:500 });
    console.log(err)
  }
  
});
app.listen(port, () => {
  console.log(`connection is setup at ${port}`);
});