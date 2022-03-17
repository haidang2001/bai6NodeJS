var express = require('express');
var router = express.Router();

//b1: ket noi
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/toursbai6",{useNewUrlParser: true, useUnifiedTopology:true},(err)=>{
    if(!err) console.log('db connected');
    else console.log('db error');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var dataDir = path.join(__dirname + 'data');
var vacationPhotoDir = path.join(dataDir,'vacation');
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

var Vacation = require('../models/vacation.js');
function saveContestEntry(contestName,email,year,month,path){
	var newPhoto = {
        contestName: contestName,
		email: email,
		year: year,
		month: month,
		path: path
    }
    var data = new Vacation(newPhoto);
    data.save();
}

router.get('/vacation-photo/:year/:month',(req,res)=>{
	res.render('vacation-photo');
})
const session = require('express-session');
router.post('/vacation-photo/:year/:month', function (req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (err) return res.redirect(303, '/error');
		if(err){
			res.session.flash = {
				type: 'danger',
				intro: 'Oops',
				message: 'There was an error processing your submission. Please try again'
			};
			return res.redirect(303,'/vacation-photo');
		}

		var photo = files.photo;
		// console.log(photo);
		var dir = vacationPhotoDir + '\\' + Date.now();
		// console.log(dir + "-----------------");
		var path = dir + '\\' + photo.newFilename +'.png';
		// console.log(path + "------------------");
		// console.log(photo.filepath);
		fs.mkdirSync(dir);
		fs.renameSync(photo.filepath, path);
		saveContestEntry('vacation-photo',fields.email, req.params.year, req.params.month,path);
		
		// req.session.flash = {
		// 	type: 'success',
		// 	intro: 'Good luck',
		// 	message: 'You have been entered into the context'
		// };

		return res.redirect(303,'/');
	});
});

module.exports = router;
