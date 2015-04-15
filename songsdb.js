
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/node-songs');

var db = mongoose.connection,
	Song = null;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

	console.log("connected");

	var schema = mongoose.Schema({
		title: String,
		artist: String,
		track: String,
		album: String,
		year: String
	});
	Song = mongoose.model('Song', schema);

	console.log("created songs");

});

function get(request, reply) {
	if(Song) {
		Song.find(function(err, song) {
			if(err) {
				reply("error");
				return;
			}
			reply(song)
		});
	}
}

function create(request, reply) {
	if(Song) {
		var song = new Song({
				title: request.payload.title, 
				artist: request.payload.artist,
				track: request.payload.track,
				album: request.payload.album,
				year: request.payload.year});
		console.log("song created - payload == " + JSON.stringify(request.payload));
		song.save(function(err) {
			if(err) {
				reply("error");
				return;
			}
			console.log("song saved");
			reply("ok");
		});

	}
}

function read(request, reply) {
	if(Song) {
		Song.find({_id: request.params.id}, function(err, song) {
			if(err) {
				reply("error");
				return;
			}
			reply(song);
		});
	}
}

function destroy(request, reply) {
	var id = request.params.id
	Song.findOne({_id:id}, function(err, song) {
		song.remove(function(err) {
			if (err) return reply(err)
			reply({id:id})
		})
	})
}

module.exports = {
	get: get,
	create: create,
	read: read,
	destroy: destroy
};



