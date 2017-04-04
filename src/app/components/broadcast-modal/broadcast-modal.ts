import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as View from '!view!./broadcast-modal.html';

import { FiresidePost } from '../../../lib/gj-lib-client/components/fireside/post/post-model';
import { Screen } from '../../../lib/gj-lib-client/components/screen/screen-service';
import { Environment } from '../../../lib/gj-lib-client/components/environment/environment.service';
import { makeObservableService } from '../../../lib/gj-lib-client/utils/vue';
import { AppJolticon } from '../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppTimeAgo } from '../../../lib/gj-lib-client/components/time/ago/ago';
import { AppWidgetCompiler } from '../../../lib/gj-lib-client/components/widget-compiler/widget-compiler';
import { Modal } from '../../../lib/gj-lib-client/components/modal/modal.service';
import { AppModal } from '../../../lib/gj-lib-client/components/modal/modal';
import { AppFiresidePostLikeWidget } from '../../../lib/gj-lib-client/components/fireside/post/like/widget/widget';
import { AppSocialTwitterShare } from '../../../lib/gj-lib-client/components/social/twitter/share/share';
import { AppSocialFacebookLike } from '../../../lib/gj-lib-client/components/social/facebook/like/like';

@View
@Component({
	components: {
		AppModal,
		AppJolticon,
		AppTimeAgo,
		AppWidgetCompiler,
		AppFiresidePostLikeWidget,
		AppSocialTwitterShare,
		AppSocialFacebookLike,
	},
})
export class AppBroadcastModal extends Vue
{
	@Prop( Modal ) modal: Modal;
	@Prop( { type: Array, default: () => [] } ) posts: FiresidePost[];

	post: FiresidePost | null = null;

	Screen = makeObservableService( Screen );
	Environment = Environment;

	created()
	{
		if ( !Screen.isXs ) {
			this.post = this.posts[0];
		}
	}
}
