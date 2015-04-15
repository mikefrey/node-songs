// Define the module for our AngularJS application.
var app = angular.module( "app", [] );

// I control the main demo.
app.controller(
	"SongsController",
	function( $scope, songService ) {

		// I contain the list of songs to be rendered.
		$scope.songs = [];

		// I contain the ngModel values for form interaction.
		$scope.form = {
			name: ""
		};

		loadRemoteData();
		// ---
		// PUBLIC METHODS.
		// ---


		// I process the add-friend form.
		$scope.addSong = function() {

			// If the data we provide is invalid, the promise will be rejected,
			// at which point we can tell the user that something went wrong. In
			// this case, I'm just logging to the console to keep things very
			// simple for the demo.
			songService.addSong( $scope.form.name ).then(
				loadRemoteData,function( errorMessage ) {
					console.warn( errorMessage );
				}
			);

			// Reset the form once values have been consumed.
			$scope.form.name = "";

		};


		// I remove the given friend from the current collection.
		$scope.removeSong = function( friend ) {

			// Rather than doing anything clever on the client-side, I'm just
			// going to reload the remote data.
			songService.removeSong( friend.id )
				.then( loadRemoteData )
			;

		};


		// ---
		// PRIVATE METHODS.
		// ---


		// I apply the remote data to the local scope.
		function applyRemoteData( newsongs ) {
			$scope.songs = newsongs;
		}


		// I load the remote data from the server.
		function loadRemoteData() {

			// The songService returns a promise.
			songService.getsongs()
				.then(
					function( songs ) {
						applyRemoteData( songs );
					}
				)
			;

		}

	}
);


// -------------------------------------------------- //
// -------------------------------------------------- //


// I act a repository for the remote friend collection.
app.service(
	"SongService",
	function( $http, $q ) {

		// Return public API.
		return({
			addSong: addSong,
			getsongs: getsongs,
			removeSong: removeSong
		});


		// ---
		// PUBLIC METHODS.
		// ---


		// I add a friend with the given name to the remote collection.
		function addSong( name ) {

			var request = $http({
				method: "post",
				url: "api/index.cfm",
				params: {
					action: "add"
				},
				data: {
					name: name
				}
			});

			return( request.then( handleSuccess, handleError ) );

		}


		// I get all of the songs in the remote collection.
		function getsongs() {

			var request = $http({
				method: "get",
				url: "api/index.cfm",
				params: {
					action: "get"
				}
			});

			return( request.then( handleSuccess, handleError ) );

		}


		// I remove the friend with the given ID from the remote collection.
		function removeSong( id ) {

			var request = $http({
				method: "delete",
				url: "api/index.cfm",
				params: {
					action: "delete"
				},
				data: {
					id: id
				}
			});

			return( request.then( handleSuccess, handleError ) );

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

				return( $q.reject( "An unknown error occurred." ) );

			}

			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) );

		}


		// I transform the successful response, unwrapping the application data
		// from the API response payload.
		function handleSuccess( response ) {

			return( response.data );

		}

	}
);