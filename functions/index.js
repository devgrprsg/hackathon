const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')

admin.initializeApp()
const app = express()

app.use(bodyParser.urlencoded({extended:false}));

const database = admin.database().ref();

app.use('/addGrades',addGrades)
app.use('/addProject',addProject)
app.use('/addComment',addComment)
/*app.use('/verifyProject',verifyProject)
app.use('/addNotification',addNotification) */

function addGrades(req,res){

    let rollNo = req.body.rollNo
    let semester = req.body.semester
    let subName1 = req.body.subName1
    let subName2 = req.body.subName2
    let subName3 = req.body.subName3
    let subName4 = req.body.subName4
    let subName5 = req.body.subName5
    let subName6 = req.body.subName6

    let subMarks1 = req.body.subMarks1
    let subMarks2 = req.body.subMarks2
    let subMarks3 = req.body.subMarks3
    let subMarks4 = req.body.subMarks4
    let subMarks5 = req.body.subMarks5
    let subMarks6 = req.body.subMarks6

    let uid = crypto.createHash('md5').update(rollNo).digest('hex')

    let gradesPath = `students/${uid}/grades/${semester}`;
    database.child(gradesPath).set({
        
        1 : `${subName1} : ${subMarks1}`,
        2 : `${subName2} : ${subMarks2}`,
        3 : `${subName3} : ${subMarks3}`,
        4 : `${subName4} : ${subMarks4}`,
        5 : `${subName5} : ${subMarks5}`,
        6 : `${subName6} : ${subMarks6}`
    })
    .then((snap) => {

        res.json({
            success : true,
            message : 'Grades updated'
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : 'Error in upgrading the grades'
        })
    })
}

function addProject(req,res){

    let rollNo = req.body.rollNo
    let projectName = req.body.projectName
    let projectDescription = req.body.projectDescription
    let gitLink = req.body.gitLink

    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let projectId = crypto.createHash('md5').update(projectName).digest('hex')

    let projectPath = `students/${uid}/projects/${projectId}`

    database.child(projectPath).set({

        projectName : projectName,
        projectDescription : projectDescription,
        gitLink : gitLink,
        verified : false,
        verifiedBy : 'none',
        rating : 'none'
    })
    .then((snap) => {

        res.json({
            success : true,
            message : "Project added successfully"
        })
    })
    .catch((err) => {

        res.json({
            success : false,
            message : "Error in adding project"
        })
    })
}

function addComment(req,res){

    let rollNo = req.body.rollNo
    let projectName = req.body.projectName
    let comment = req.body.comment
    let teacherName = req.body.teacherName


    let commentPath = crypto.createHash('md5').update(rollNo).digest('hex')
    let projectId = crypto.createHash('md5').update(projectName).digest('hex')

}

exports.api = functions.https.onRequest(app)