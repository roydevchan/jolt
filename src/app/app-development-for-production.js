angular.module( 'App' ).config( function( EnvironmentProvider, $compileProvider )
{
	EnvironmentProvider.env = 'production';
	EnvironmentProvider.buildType = 'development';
	$compileProvider.debugInfoEnabled( true );
} );
