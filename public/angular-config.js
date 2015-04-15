// Define the module for our AngularJS application.
var app = angular.module( "app", [] )

// I control the main demo.
app.controller(
	"SongsController",
	function( $scope, SongService ) {

		// I contain the list of songs to be rendered.
		$scope.songs = []

		// I contain the ngModel values for form interaction.
		$scope.form = {}

		loadRemoteData()
		// ---
		// PUBLIC METHODS.
		// ---


		// I process the add-song form.
		$scope.addSong = function() {

			// If the data we provide is invalid, the promise will be rejected,
			// at which point we can tell the user that something went wrong. In
			// this case, I'm just logging to the console to keep things very
			// simple for the demo.
			SongService.addSong($scope.form).then(
				function() {
					loadRemoteData()

					// Reset the form once values have been consumed.
					$scope.form = {}
				}, console.warn.bind(console))

		}


		// I update the given song from the current collection.
		$scope.updateSong = function( song ) {

			// Rather than doing anything clever on the client-side, I'm just
			// going to reload the remote data.
			SongService.updateSong( song )
				.then( loadRemoteData )
			

		}


		// I remove the given song from the current collection.
		$scope.deleteSong = function( song ) {

			// Rather than doing anything clever on the client-side, I'm just
			// going to reload the remote data.
			SongService.deleteSong( song._id )
				.then( loadRemoteData )
			

		}


		// ---
		// PRIVATE METHODS.
		// ---

		// I load the remote data from the server.
		function loadRemoteData() {

			// The SongService returns a promise.
			SongService.getSongs()
				.then(
					function( songs ) {
						$scope.songs = songs
					}
				)
			

		}

	}
)


// -------------------------------------------------- //
// -------------------------------------------------- //


// I act a repository for the remote song collection.
app.service(
	"SongService",
	function( $http, $q ) {

		// Return public API.
		return({
			addSong: addSong,
			getSongs: getSongs,
			deleteSong: deleteSong
		})


		// ---
		// PUBLIC METHODS.
		// ---


		// I add a song with the given title to the remote collection.
		function addSong( data ) {

			var request = $http({
				method: "post",
				url: "api/songs",
				data: data
			})

			return( request.then( handleSuccess, handleError ) )

		}


		// I add a song with the given title to the remote collection.
		function updateSong( data ) {

			var request = $http({
				method: "put",
				url: "api/songs/" + data._id,
				data: data
			})

			return( request.then( handleSuccess, handleError ) )

		}


		// I get all of the songs in the remote collection.
		function getSongs() {

			var request = $http({
				method: "get",
				url: "api/songs"
			})

			return( request.then( handleSuccess, handleError ) )

		}


		// I remove the song with the given _ID from the remote collection.
		function deleteSong( _id ) {

			var request = $http({
				method: "delete",
				url: "api/songs/" + _id
			})

			return( request.then( handleSuccess, handleError ) )

		}


		// ---
		// PRIVATE METHODS.
		// ---


		// I transform the error response, unwrapping the application dta from
		// the API response payload.
		function handleError( response ) {

			// The API response from the server should be returned in a
			// nomralized format. However, if the request was not handled by the
			// server (or what not handles properly - ex. server error), then we
			// may have to normalize it on our end, as best we can.
			if (
				! angular.isObject( response.data ) ||
				! response.data.message
				) {

				return( $q.reject( "An unknown error occurred." ) )

			}

			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) )

		}


		// I transform the successful response, unwrapping the application data
		// from the API response payload.
		function handleSuccess( response ) {

			return( response.data )

		}

	}
)
