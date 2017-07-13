import { Component, Prop } from 'vue-property-decorator';
import * as View from '!view!./song.html';

import { GameSong } from '../../../../../lib/gj-lib-client/components/game/song/song.model';
import {
	BaseForm,
	FormOnInit,
} from '../../../../../lib/gj-lib-client/components/form-vue/form.service';
import { AppFormLoader } from '../../../../../lib/gj-lib-client/components/form-vue/loader/loader';
import { Game } from '../../../../../lib/gj-lib-client/components/game/game.model';
import { number } from '../../../../../lib/gj-lib-client/vue/filters/number';
import { AppFormControlUpload } from '../../../../../lib/gj-lib-client/components/form-vue/control/upload/upload';

@View
@Component({
	components: {
		AppFormLoader,
		AppFormControlUpload,
	},
})
export class FormGameSong extends BaseForm<GameSong> implements FormOnInit {
	@Prop(Game) game: Game;

	modelClass = GameSong;
	maxFilesize = 0;

	number = number;

	get fileLabel() {
		if (this.method === 'add') {
			return this.$gettext('dash.games.music.form.add_file_label');
		} else {
			return this.$gettext('dash.games.music.form.change_file_label');
		}
	}

	onInit() {
		// scope.formModel.file = undefined;
		this.setField('game_id', this.game.id);
	}

	onLoaded(payload: any) {
		this.maxFilesize = payload.maxFilesize;
	}
}

// angular.module( 'App.Forms.Dashboard' ).directive( 'gjFormDashboardGameSong', function( Form, Api, gettextCatalog )
// {
// 	var form = new Form( {
// 		model: 'Game_Song',
// 		template: require( './song.html' ),
// 	} );

// 	form.scope.game = '=gjGame';

// 	form.onInit = function( scope )
// 	{
// 		scope.Loader = Loader;
// 		Loader.load( 'upload' );

// 		scope.formModel.game_id = scope.game.id;

// 		if ( !scope.isLoaded ) {
// 			Api.sendRequest( '/web/dash/developer/games/music/save/' + scope.formModel.game_id ).then( function( payload )
// 			{
// 				scope.isLoaded = true;
// 				angular.extend( scope, payload );
// 			} );
// 		}

// 		scope.getFileLabel = function()
// 		{
// 			if ( scope.method === 'add' ) {
// 				return gettextCatalog.getString( 'dash.games.music.form.add_file_label' );
// 			}
// 			else {
// 				return gettextCatalog.getString( 'dash.games.music.form.change_file_label' );
// 			}
// 		};
// 	};

// 	return form;
// } );
