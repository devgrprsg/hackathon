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
app.use('/verifyProject',verifyProject)
app.use('/addNotification',addNotification)
app.use('/addPersonalData',addPersonalData)
app.use('/deletePersonalData',deletePersonalData)
app.use('/addStudent',addStudent)
app.use('/addTeacher',addTeacher)
app.use('/getProjectNames',getProjectNames)

app.get('/getPersonalData',getPersonalInfo)
app.get('/getResults',getResults)
app.get('/getProjects',getProjects)
app.get('/getTeacherNotifications',getTeacherNotifications)
app.get('/getDepartmentTeachers',getDepartmentTeachers)

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
        return res.send(snap.val())
    })
    .catch((err) => {

        res.json({
            err : err,
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

        return res.send(snap.val())
    })
    .catch((err) => {

        res.json({
            err : err,
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


    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let projectId = crypto.createHash('md5').update(projectName).digest('hex')

    let commentPath = `students/${uid}/projects/${projectId}/comments`

    database.child(commentPath).push({
      
        teacherName : teacherName,
        comment : comment
    })
    .then((snap) => {

        return res.send(snap.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in adding comment"
        })
    })
}

function verifyProject(req,res){

    let rollNo = req.body.rollNo
    let projectName = req.body.projectName
    let teacherName = req.body.teacherName
    let rating = req.body.rating

    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let projectId = crypto.createHash('md5').update(projectName).digest('hex')

    let projectPath = `students/${uid}/projects/${projectId}`

    database.child(projectPath).once('value')
    .then((snapshot) => {

        let data = {
            projectName : snapshot.val().projectName,
            projectDescription : snapshot.val().projectDescription,
            gitLink : snapshot.val().gitLink,
            verified : true,
            verifiedBy : teacherName,
            rating : rating
        }

        return database.child(projectPath).update(data)
    })
    .then((snap) => {

        return res.send(snap.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in project verification"
        })
    })
}

function addNotification(req,res){

    let teacherName = req.body.teacherName
    let projectLink = req.body.projectLink
    let rollNo = req.body.rollNo

    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    //let projectId = crypto.createHash('md5').update(projectName).digest('hex')
    let teacherId = crypto.createHash('md5').update(teacherName).digest('hex')

    let notificationPath = `teachers/${teacherId}/notification`

    database.child(notificationPath).push({

        RollNo : rollNo,
        ProjectLink : projectLink
    })
    .then((snap) => {

        return res.send(snap.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in adding notification"
        })
    })
}

function addPersonalData(req,res){

    let fieldName = req.body.fieldName
    let description = req.body.description
    let rollNo = req.body.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let fieldId = crypto.createHash('md5').update(fieldName).digest('hex')

    let fieldPath = `students/${uid}/data/${fieldId}`

    database.child(fieldPath).set({
        fieldName : fieldName,
        description : description
    })
    .then((snap) => {

        return res.json({
            success : true,
            data : snap.val()
        })
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in adding field"
        })
    })
}

function deletePersonalData(req,res){

    let fieldName = req.body.fieldName
    let rollNo = req.body.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let fieldId = crypto.createHash('md5').update(fieldName).digest('hex')

    let fieldPath = `students/${uid}/data/${fieldId}`

    database.child(fieldPath).remove()
    .then((snapshot) => {

        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in deleting personal data"
        })
    })
}

function addStudent(req,res){

    let rollNo = req.body.rollNo
    let password = req.body.studentPass

    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let hashPassword = crypto.createHash('md5').update(password).digest('hex')
    let studentPath = `studentCredentials/${uid}`

    database.child(studentPath).set({
        password : hashPassword
    })
    .then(() => {

        return res.json({
            success : true,
            message : "Student added successfully"
        })
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in adding student"
        })
    })
}

function addTeacher(req,res){

    let teacherName = req.body.teacherName
    let teacherId = req.body.teacherId
    let password = req.body.teacherPass
    let department = req.body.department

    let uid = crypto.createHash('md5').update(teacherId).digest('hex')
    let hashPassword = crypto.createHash('md5').update(password).digest('hex')
    let teacherPath = `teacherCredentials/${department}/${uid}`

    database.child(teacherPath).set({
        teacherName : teacherName,
        password : hashPassword
    })
    .then(() => {

        return res.json({
            success : true,
            message : "Teacher added successfully"
        })
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in adding student"
        })
    })
}

function getPersonalInfo(req,res){

    let rollNo = req.query.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let path = `students/${uid}/data`

    database.child(path).once('value')
    .then((snapshot) => {

        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Failed to fetch data"
        })
    })
}

function getResults(req,res){

    let rollNo = req.query.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let path = `students/${uid}/results`

    database.child(path).once('value')
    .then((snapshot) => {

        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Failed to fetch data"
        })
    })
}

function getProjects(req,res){

    let rollNo = req.query.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let path = `students/${uid}/projects`

    database.child(path).once('value')
    .then((snapshot) => {

        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Failed to fetch data"
        })
    })
}

function getDepartmentTeachers(req,res){

    let department = req.query.department
    let path = `teacherCredentials/${department}`
    database.child(path)
    .then((snapshot) => {

        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in fetching data"
        })
    })
}

function getTeacherNotifications(req,res){

    let teacherId = req.body.teacherId
    let hash = crypto.createHash('md5').update(teacherId).digest('hex')
    let path = `teachers/${hash}`

    database.child(path).once('value')
    .then((snapshot) => {
        return res.send(snapshot.val())
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error in fetching data"
        })
    })
}

function getProjectNames(req,res){

    let rollNo = req.body.rollNo
    let uid = crypto.createHash('md5').update(rollNo).digest('hex')
    let path = `students/${uid}/projects`

    database.child(path).once('value')
    .then((snapshot) => {

        let allData = snapshot.val()

        let output = []

        for(i in allData)
        {
            let name = allData[i].projectName

            output.push({
                projectName : name
            })
        }

        return res.send(output)
    })
    .catch((err) => {

        res.json({

            err : err,
            success : false,
            message : "Error"
        })
    })
}

exports.api = functions.https.onRequest(app)