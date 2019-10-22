import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class/lib/bindings';
import { AppStore } from '../../../../store/app-store';
import AppUserCardHover from '../../../../user/card/hover/hover.vue';
import { User } from '../../../../user/user.model';
import { ContentOwner } from '../../../content-owner';

@Component({
	components: {
		AppUserCardHover,
	},
})
export default class AppContentViewerMention extends Vue {
	@Prop(String)
	username!: string;
	@Prop(Object)
	owner!: ContentOwner;

	@State
	app!: AppStore;

	user: User | null = null;

	get isLoggedInUser() {
		return this.app.user && this.app.user.username === this.username;
	}

	created() {
		// Make sure we never execute a promise if we don't have to, it would break SSR.
		this.owner.getHydrator().useData<any>('username', this.username, data => {
			if (data !== null) {
				this.user = new User(data);
			}
		});
	}
}
