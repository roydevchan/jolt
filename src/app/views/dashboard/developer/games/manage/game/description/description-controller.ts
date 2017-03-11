import { Injectable, Inject } from 'ng-metadata/core';
import { App } from '../../../../../../../app-service';
import { FormDashboardGameWizard } from '../../../../../../../components/forms/dashboard/game/wizard/wizard-service';
import { Scroll } from '../../../../../../../../lib/gj-lib-client/components/scroll/scroll.service';

@Injectable()
export class DescriptionCtrl
{
	constructor(
		@Inject( 'App' ) app: App,
		@Inject( '$scope' ) private $scope: ng.IScope,
		@Inject( 'FormDashboardGameWizard' ) private wizard: FormDashboardGameWizard,
		@Inject( 'gettextCatalog' ) private gettextCatalog: ng.gettext.gettextCatalog,
		@Inject( 'Growls' ) private growls: any,
	)
	{
		app.title = gettextCatalog.getString( 'Edit Description for {{ game }}', { game: $scope['manageCtrl'].game.title } );
	}

	onSaved()
	{
		if ( this.$scope['manageCtrl'].isWizard ) {
			this.wizard.goNext( this.$scope['manageCtrl'].game );
			return;
		}

		this.growls.success(
			this.gettextCatalog.getString( 'Your game description has been saved.' ),
			this.gettextCatalog.getString( 'Description Saved' )
		);
		Scroll.to( 0 );
	}
}
