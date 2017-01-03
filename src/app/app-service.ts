import { Injectable, Inject } from 'ng-metadata/core';
import { Meta } from './../lib/gj-lib-client/components/meta/meta-service';
import { ModalConfirm } from './../lib/gj-lib-client/components/modal/confirm/confirm-service';

@Injectable()
export class App
{
	ver: number | null = null;
	user: any = null;
	userBootstrapped = false;

	constructor(
		@Inject( '$rootScope' ) $rootScope: ng.IRootScopeService,
		@Inject( '$state' ) private $state: ng.ui.IStateService,
		@Inject( '$injector' ) private $injector: any,
		@Inject( '$q' ) private $q: ng.IQService,
		@Inject( 'ModalConfirm' ) private modalConfirm: ModalConfirm,
		@Inject( 'Growls' ) private growls: any,
		@Inject( 'Meta' ) private meta: Meta,
	)
	{
		// Payload emits this every time the user is processed.
		// We want to store whether or not we've bootstrapped the user yet so we can hide things
		// that depend on the user being loaded in.
		$rootScope.$on( 'Payload.userProcessed', () =>
		{
			if ( !this.userBootstrapped ) {
				this.userBootstrapped = true;
			}
		} );
	}

	get title() { return this.meta.title; }
	set title( title: string | null ) { this.meta.title = title; }

	logout()
	{
		return this.$q( ( resolve, reject ) =>
		{
			this.modalConfirm.show( 'Are you seriously going to leave us?', 'Really?', 'yes' ).then( () =>
			{
				// Must send POST.
				this.$injector.get( 'Api' ).sendRequest( '/web/dash/account/logout', {} )
					.then( () =>
					{
						// We go to the homepage currently just in case they're in a view they shouldn't be.
						this.$state.go( 'discover.home' );

						this.growls.success( 'You are now logged out.', 'Goodbye!' );
						resolve();
					} )
					.catch( ( err: any ) =>
					{
						console.error( err );
						this.growls.error( 'Could not log you out.' );
						reject();
					} );
			} );
		} );
	}
}
