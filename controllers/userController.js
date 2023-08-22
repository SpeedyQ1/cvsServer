const User = require("../models/users");
const Cv = require("../models/cv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = new User({ email, password: hash });
  try {
    await User.create(newUser);
    res.status(200).send(newUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email });
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const realId = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: realId.id }).populate("cvs");

    if (!user) {
      return res.status(401).json({ message: "not loged in" });
    } else {
      return res.status(202).json({ user });
    }
  } catch (err) {
    res.status(501).send(err);
  }
};


exports.createNewCv = async (req, res) => {
  try {
    console.log();
    const newCv = await Cv.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      img: req.body.img,
      jobTitle: req.body.jobTitle,
      theEmail: req.body.theEmail,
      phone: req.body.phone,
      address: req.body.address,
      summary: req.body.summary,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      languages: req.body.languages,
      hobbies: req.body.hobbies,
      template: req.body.template,
    });
    console.log('hello2');

    const realId = jwt.verify(req.body.token, process.env.JWT_SECRET);
   
    const updateCv = await User.findByIdAndUpdate(
      realId.id,
      { $push: { cvs: { _id: newCv._id } } },
      { new: true }
    );

    res.status(201).json(updateCv);
  } catch {
    res.status(401).send("uf");
  }
};


exports.getCvsByToken = async (req, res) => {
  try {
    const realId = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: realId.id }).populate("cvs");
    const cvsArr= user.cvs
    console.log(cvsArr);

    if (!user) {
      return res.status(401).json({ message: "not loged in" });
    } else {
      return res.status(202).json( cvsArr );
    }
  } catch (err) {
    res.status(501).send(err);
  }
};


exports.editCv = async (req, res) => {
  try {
  
    const newCv = await Cv.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      img: req.body.img,
      jobTitle: req.body.jobTitle,
      theEmail: req.body.theEmail,
      phone: req.body.phone,
      address: req.body.address,
      summary: req.body.summary,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      languages: req.body.languages,
      hobbies: req.body.hobbies,
      template: req.body.template,
    });

    const cvIdToChange = req.body.cvIdToChange;
    const realId = jwt.verify(req.body.token, process.env.JWT_SECRET).id;
    const tempUser = await User.findById(realId);
    const cvsArr = tempUser.cvs;

    const newArr = cvsArr.map(cv => {
      if (cv._id.toString() === cvIdToChange) {
        return newCv._id;
      }
      return cv;
    });
    
    const cvToDelete = await Cv.findByIdAndDelete(cvIdToChange);

    const updateCv = await User.findByIdAndUpdate(
      realId,
      { $set: { cvs: newArr } },
      { new: true }
    );

    res.status(201).json(updateCv);
  } catch {
    res.status(401).send("uf");
  }
};

exports.deleteCv = async (req, res) => {
  const realId = jwt.verify(req.body.token, process.env.JWT_SECRET).id;
  try {
    await Cv.findByIdAndDelete(req.body.cvid);

    const newUser = await User.findByIdAndUpdate(
      realId,
      {
        $pull: {cvs : { $in : req.body.cvid  }},
      },
      { new: true }
    );
    res.status(201).json(newUser);
  } catch (err){
    res.status(504).json(err.message);
  }
};

exports.keepAwake = async (req, res) => {
 
  try {
    res.status(201).json("awake");
  } catch (err){
    res.status(504).json(err.message);
  }
};
