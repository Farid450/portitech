/**
 * Created by aarchamb on 20/04/2017.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Jeux = mongoose.model('game');
var util = require('util');
var Utils = require('../utils');
var utils = new Utils();
var GestionResultatJeux = require('../public/javascripts/gestionGainJeux');
var gestionResultatJeux = new GestionResultatJeux();

var Boule = require('../public/javascripts/jeux/anthony/boule');
var gestionGainJeux = require('../public/javascripts/gestionGainJeux');
var boule = new Boule();
var game = {};

game.numbers = [1,2,3,4,5,6,7,8,9];
game.colors = ["Rouge","Noir"];

router.post('/score', function(req,res){
    gestionResultatJeux.gestionResultat(req)
});
router.get('/score', function(req,res){
    console.log("get sur score")
});

router.get('/', function(req,res,next){
    var allGames = [];
    allGames = Jeux.find({}, function(err, allGames) {
        var render = { games:{}, user: req.user, msgs:utils.read_messages(req)};
        if(!err){
            render = {games : allGames, user: req.user, msgs:utils.read_messages(req)};
        }
        res.render('jeux/home', render);
    })
});

router.get('/anthony', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/anthony/home',{user : req.user, msgs:utils.read_messages(req)});
});

router.get('/boule', function(req,res,next){

    utils.HasToBeConnected(req,res);

    if(req.session && req.session.userId){
        User.findById(req.session.userId,function(err,user){
            if (err) return next(err);
            if (!user) req.session.destroy();
            else req.user = user; // on ne sauvegarde pas l'user dans une var de session, mais dans une var temporaire à la requete
        });
    }
    res.render('jeux/anthony/boule',{game :game,user : req.user,title: 'Signup', msgs:utils.read_messages(req)});

});

router.post('/boule', function(req,res,next){
    var render = {};

    if (req.body && (req.body.miseNum || req.body.miseColor)){

        game.num = req.body.num;
        game.color = req.body.color;
        game.miseNum = req.body.miseNum;
        game.miseColor = req.body.miseColor;
        game.money = req.session.user.money;
        game = boule.lancerPartie(game);


        User.update({ _id: req.session.user._id }, { $set: { money: game.money }}, function (err, tank) {
            if (err) console.log(err);
        });

        req.session.user.money = game.money;
        render = {user: req.session.user,game: game,title: 'Signup',msgs: utils.read_messages(req)};

    }else{
        res.status(401);
        utils.new_message(req,{type:'danger',msg:'Vous n\'avez rien misé !' });
        render = {game : game,user : req.session.user, msgs:utils.read_messages(req)};
    }

    console.log(req.body);
    res.render('jeux/anthony/boule',render);

});

var user = {name:"Tetris"};
router.get('/Tetris/', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/Tetris/accueil',{user:req.session.user, msgs:utils.read_messages(req)});
});

router.get('/puzzle', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/anthony/godcat',{user:req.session.user, msgs:utils.read_messages(req)});
});

router.get('/invader', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/anthony/catInvader',{user:req.session.user, msgs:utils.read_messages(req)});
});

var user = {name:"Brudele"};
//GET method
router.get('/laby', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/brudele/accueil',{user:req.session.user, msgs:utils.read_messages(req)});
});


//GET method
router.get('/brudele/scores', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/brudele/score', {user:req.session.user, msgs:utils.read_messages(req)});
});

//GET method
router.get('/mahmutSport', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/mahmut/index', {user:req.session.user, msgs:utils.read_messages(req)});
});


//POST method
router.post('/brudele/score', function(req,res,next){

});

//GET method
router.get('/BreakOut', function(req,res,next){
    utils.HasToBeConnected(req,res);
    res.render('jeux/BreakOut/brk', {user:req.session.user, msgs:utils.read_messages(req)});
});

module.exports = router;





