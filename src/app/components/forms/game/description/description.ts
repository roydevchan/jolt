import { Component } from 'vue-property-decorator';
import * as View from '!view!./description.html';

import {
	BaseForm,
	FormOnInit,
} from '../../../../../lib/gj-lib-client/components/form-vue/form.service';
import { Game } from '../../../../../lib/gj-lib-client/components/game/game.model';
import { AppExpand } from '../../../../../lib/gj-lib-client/components/expand/expand';
import { AppFormControlMarkdown } from '../../../../../lib/gj-lib-client/components/form-vue/control/markdown/markdown';
import { AppJolticon } from '../../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppDashGameWizardControls } from '../wizard-controls/wizard-controls';

@View
@Component({
	components: {
		AppExpand,
		AppFormControlMarkdown,
		AppJolticon,
		AppDashGameWizardControls,
	},
})
export class FormGameDescription extends BaseForm<Game> implements FormOnInit {
	modelClass = Game;
	saveMethod = '$saveDescription' as '$saveDescription';

	onInit() {
		// TODO(rewrite)
		// scope.$watchCollection( 'formState.serverErrors["autotag-fnaf"]', ( isFnafDetected: boolean ) =>
		// {
		// 	// This will make it so they can't edit the form and force them to choose if they want to tag or not.
		// 	if ( isFnafDetected ) {
		// 		scope.isFnafDetected = true;
		// 		scope.isDisabled = true;
		// 	}
		// } );
	}

	addAutotag(tag: string) {
		(this.formModel as any).autotag = tag;

		// TODO(rewrite)
		// this.onSubmit();
	}

	skipAutotag() {
		(this.formModel as any).autotag_skip = true;

		// TODO(rewrite)
		// scope.onSubmit();
	}
}
