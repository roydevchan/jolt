import Vue from 'vue';
import VueRouter from 'vue-router';
import { Component } from 'vue-property-decorator';

import { AuthLinkedAccountProcessing } from '../../_processing/processing';
import { BeforeRouteEnter } from '../../../../../../lib/gj-lib-client/utils/router';
import { Api } from '../../../../../../lib/gj-lib-client/components/api/api.service';
import { Growls } from '../../../../../../lib/gj-lib-client/components/growls/growls.service';
import { Auth } from '../../../../../../lib/gj-lib-client/components/auth/auth.service';

@Component({})
export default class RouteAuthLinkedAccountFacebookCallback extends Vue
{
	@BeforeRouteEnter()
	routeEnter( this: undefined, route: VueRouter.Route )
	{
		const { code, state } = route.query;
		return Api.sendRequest(
			'/web/auth/facebook/callback?code=' + code + '&state=' + state,
			{},
		);
	}

	routed()
	{
		if ( !this.$payload.success ) {

			if ( this.$payload.reason && this.$payload.reason === 'no-email' ) {
				Growls.error( {
					sticky: true,
					message: this.$gettext( `auth.linked_account.facebook.no_email_growl` ),
				} );
			}
			else if ( this.$payload.reason && this.$payload.reason === 'duplicate-email' ) {
				Growls.error( {
					sticky: true,
					message: this.$gettext( `auth.linked_account.facebook.duplicate_email_growl` ),
				} );
			}
			else {
				Growls.error( {
					sticky: true,
					title: this.$gettext( 'Login Failed' ),
					message: this.$gettext( 'auth.linked_account.facebook.failed_growl' ),
				} );
			}
			this.$router.push( { name: 'auth.join' } );
			return;
		}

		Auth.redirectDashboard();
	}

	render( h: Vue.CreateElement )
	{
		return h( AuthLinkedAccountProcessing );
	}
}
