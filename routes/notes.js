const express = require('express');
const router = express.Router();
const Note = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');
const { trusted } = require('mongoose');



//Route:1 / / Fecthing all notes of logged in user using GET:./notes/fetchallnotes. Login required //
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user })
        res.send(notes)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }

});


//Route:2/ /  Adding new notes logged in user using POST:./notes/addnotes.  Login required //
router.post('/addnotes', fetchuser, [
    body('title', "title must be of 3 charactes").isLength({ min: 3 }),
    body('des', "des must be of 5 charactes").isLength({ min: 5 }),

], async (req, res) => {

    try {
        const { title, des, tag } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const note = new Note({
            title, des, tag, user: (req.user)
        });

        const savedNote = await note.save()
        //console.log((req.user))
        res.send(savedNote)



    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }

});



//Route:3/ /  Updating the existing notes of a logged in user using PUT:./notes/updatenote/id:.  Login required //
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { tag, des, title } = req.body;
    // console.log(req.body)

    //create a newNote object//
    const newNote = {};

    if (title) { newNote.title = title };
    if (des) { newNote.des = des };
    if (tag) { newNote.tag = tag };


    try {

        //Find the new note to be updated and update it//

        //we are finding note in notes collection whose id is(re.params.id) not the user id.
        let note = await Note.findById(req.params.id);
        if (!note) { return res.send("Not Found") };


        //If logged in user wants to access someone others note then denied the access// 
        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        //  console.log(req.params.id);
        //console.log(req.user);
        // console.log(note.user.toString());
        res.send(note);



    } catch (error) {

        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }

});






//Route:3/ /  Updating the existing notes of a logged in user using PUT:./notes/updatenote/id:.  Login required //
//router.get('/updatenote/:id', fetchuser, async (req, res) => {

//in req.body it is the {title,des,tag} which we are sending through the thunder client//
// const { tag, des, title } = req.body;
// console.log(req.body.title)

//console.info(Note); res.send(Note.user)


//(the findbyid is used to find by id of the note not to the id of the user associated with the note//)
//let note = await Note.findById("6771406aa8dce34904ee557a");

/*  {
      _id: new ObjectId('6771406aa8dce34904ee557a'),
          user: new ObjectId('67714047a8dce34904ee5576'),
              title: 'Jane 2 ',
                  des: 'Jane Eyre is a bildungsroman that follows the experiences of its eponymous heroine, including her growth to adulthood and her love for',
      console.log(note)               
  }*/
// console.log(req.params.id)


router.delete('/deletenote/:id', fetchuser, async (req, res) => {


    try {



        //we are finding note in notes collection whose id is(re.params.id) not the user id.
        let note = await Note.findById(req.params.id);
        if (!note) { return res.send("Not Found") };


        //If logged in user wants to access someone others note then denied the access// 
        //allow deletion only if user is autenticated//

        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);

        //  console.log(req.params.id);
        //console.log(req.user);
        // console.log(note.user.toString());
        res.send(note);


        //write a functionality to undo the change using res.send(note)


    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" });
    }

});



//})









module.exports = router;