import { Component } from 'vue-property-decorator';
import * as View from '!view!./overview.html';

import { Meta } from '../../../../../lib/gj-lib-client/components/meta/meta-service';
import { ForumCategory } from '../../../../../lib/gj-lib-client/components/forum/category/category.model';
import { ForumChannel } from '../../../../../lib/gj-lib-client/components/forum/channel/channel.model';
import { ForumPost } from '../../../../../lib/gj-lib-client/components/forum/post/post.model';
import { Api } from '../../../../../lib/gj-lib-client/components/api/api.service';
import { AppForumRules } from '../../../../components/forum/rules/rules';
import { AppForumChannelList } from '../../../../components/forum/channel-list/channel-list';
import {
	BaseRouteComponent,
	RouteResolve,
} from '../../../../../lib/gj-lib-client/components/route/route-component';

@View
@Component({
	name: 'RouteForumsLandingOverview',
	components: {
		AppForumRules,
		AppForumChannelList,
	},
})
export default class RouteForumsLandingOverview extends BaseRouteComponent {
	categories: ForumCategory[] = [];
	groupedChannels: { [k: number]: ForumChannel[] } = {};
	latestPosts: ForumPost[] = [];
	postCountPerPage = 0;

	@RouteResolve({ cache: true })
	routeResolve(this: undefined) {
		return Api.sendRequest('/web/forums');
	}

	routeInit() {
		Meta.title = this.$gettext('Forums');
	}

	routed() {
		this.categories = ForumCategory.populate(this.$payload.categories);
		this.latestPosts = ForumPost.populate(this.$payload.latestPosts);
		this.postCountPerPage = this.$payload.postCountPerPage;

		this.groupedChannels = {};
		const channels = ForumChannel.populate(this.$payload.channels);
		for (const channel of channels) {
			if (!this.groupedChannels[channel.category.id]) {
				this.groupedChannels[channel.category.id] = [];
			}

			this.groupedChannels[channel.category.id].push(channel);
		}
	}
}
