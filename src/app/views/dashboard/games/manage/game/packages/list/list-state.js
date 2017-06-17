angular.module('App.Views').config(function($stateProvider) {
	$stateProvider.state('dash.games.manage.game.packages.list', {
		url: '',
		controller: 'Dashboard.Developer.Games.Manage.Game.Packages.ListCtrl',
		controllerAs: 'listCtrl',
		templateUrl: require('./list.html'),
		resolve: {
			packagesPayload: function($stateParams, Api) {
				return Api.sendRequest(
					'/web/dash/developer/games/packages/' + $stateParams.id,
				);
			},
			checkRedirect: function($state, $stateParams, packagesPayload) {
				if (!packagesPayload.packages.length) {
					$state.go('dash.games.manage.game.packages.add', $stateParams);
				}
			},
		},
	});
});
