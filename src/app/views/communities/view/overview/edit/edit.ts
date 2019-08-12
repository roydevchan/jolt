import { Api } from 'game-jolt-frontend-lib/components/api/api.service';
import AppCardListAdd from 'game-jolt-frontend-lib/components/card/list/add/add.vue';
import AppCardListItem from 'game-jolt-frontend-lib/components/card/list/item/item.vue';
import AppCardList from 'game-jolt-frontend-lib/components/card/list/list.vue';
import { Collaborator } from 'game-jolt-frontend-lib/components/collaborator/collaborator.model';
import { CommunityTag } from 'game-jolt-frontend-lib/components/community/tag/tag.model';
import AppCommunityThumbnailImg from 'game-jolt-frontend-lib/components/community/thumbnail/img/img.vue';
import AppEditableOverlay from 'game-jolt-frontend-lib/components/editable-overlay/editable-overlay.vue';
import { Growls } from 'game-jolt-frontend-lib/components/growls/growls.service';
import { ModalConfirm } from 'game-jolt-frontend-lib/components/modal/confirm/confirm-service';
import {
	BaseRouteComponent,
	RouteResolver,
} from 'game-jolt-frontend-lib/components/route/route-component';
import { WithRouteStore } from 'game-jolt-frontend-lib/components/route/route-store';
import { Screen } from 'game-jolt-frontend-lib/components/screen/screen-service';
import { AppTooltip } from 'game-jolt-frontend-lib/components/tooltip/tooltip';
import { arrayRemove } from 'game-jolt-frontend-lib/utils/array';
import { enforceLocation } from 'game-jolt-frontend-lib/utils/router';
import Component from 'vue-class-component';
import { AppCommunityPerms } from '../../../../../components/community/perms/perms';
import FormCommunityCollaborator from '../../../../../components/forms/community/collaborator/collaborator.vue';
import FormCommunityTag from '../../../../../components/forms/community/tag/tag.vue';
import { CommunityThumbnailModal } from '../../../../../components/forms/community/thumbnail/modal/modal.service';
import { store } from '../../../../../store';
import { RouteStore, routeStore, RouteStoreModule, RouteStoreName } from './edit.store';
import AppCommunitiesOverviewEditNotice from './_notice/notice.vue';

const draggable = require('vuedraggable');

@Component({
	name: 'RouteCommunitiesViewEdit',
	components: {
		AppCommunitiesOverviewEditNotice,
		FormCommunityTag,
		draggable,
		AppCardList,
		AppCardListItem,
		AppCardListAdd,
		FormCommunityCollaborator,
		AppCommunityPerms,
		AppEditableOverlay,
		AppCommunityThumbnailImg,
	},
	directives: {
		AppTooltip,
	},
})
@WithRouteStore({
	store,
	routeStoreName: RouteStoreName,
	routeStoreClass: RouteStore,
})
@RouteResolver({
	deps: { params: ['id'] },
	async resolver({ route }) {
		const payload = await Api.sendRequest('/web/dash/communities/' + route.params.id, {});

		if (payload && payload.community) {
			const redirect = enforceLocation(route, { path: payload.community.path });
			if (redirect) {
				return redirect;
			}
		}

		return payload;
	},
	resolveStore({ payload }) {
		if (payload) {
			routeStore.commit('populate', payload);
		}
	},
})
export default class RouteCommunitiesViewEdit extends BaseRouteComponent {
	@RouteStoreModule.State
	community!: RouteStore['community'];
	@RouteStoreModule.State
	collaboration!: RouteStore['collaboration'];

	collaborators: Collaborator[] = [];
	activeCollaborator: Collaborator | null = null;
	isShowingCollaboratorAdd = false;

	readonly Collaborator = Collaborator;
	readonly Screen = Screen;

	get routeTitle() {
		if (this.community) {
			return this.$gettextInterpolate(`Edit Community %{ community }`, {
				community: this.community.name,
			});
		}
		return null;
	}

	get isOwner() {
		// The owner's collaboration is not returned from backend.
		return this.collaboration === null;
	}

	get shouldShowThumbnail() {
		return Screen.isXs;
	}

	routeResolved($payload: any) {
		if ($payload.collaborators) {
			this.collaborators = Collaborator.populate($payload.collaborators);
			if (!this.collaborators.length) {
				this.isShowingCollaboratorAdd = true;
			}
		}
	}

	onTagsChange() {
		this.$emit('tags-change', this.community.tags);
	}

	async saveTagSort() {
		try {
			await CommunityTag.$saveSort(this.community.id, this.community.tags!.map(i => i.id));
			this.onTagsChange();
		} catch (e) {
			console.error(e);
			Growls.error('Could not save tag arrangement.');
		}
	}

	onTagAdded(tag: CommunityTag) {
		this.community.tags!.unshift(tag);
		this.onTagsChange();
	}

	async onClickRemoveTag(tag: CommunityTag) {
		try {
			await tag.$remove();
		} catch (e) {
			console.error(e);
			Growls.error('Could not remove tag');
		}

		if (tag._removed) {
			this.community.tags = this.community.tags!.filter(i => i.id !== tag.id);
		}

		this.onTagsChange();
	}

	onAddedCollaborator(collaborator: Collaborator) {
		this.isShowingCollaboratorAdd = false;
		this.collaborators.push(collaborator);
	}

	onSavedCollaborator() {
		this.activeCollaborator = null;
	}

	async removeCollaborator(collaborator: Collaborator) {
		const ret = await ModalConfirm.show(
			this.$gettext(
				`Are you sure you want to remove this collaborator? They will no longer be able to make changes to the community.`
			),
			this.$gettext('Remove Collaborator?')
		);

		if (!ret) {
			return;
		}

		try {
			await collaborator.$remove();

			Growls.success(
				this.$gettext('The collaborator has been removed.'),
				this.$gettext('Collaborator Removed')
			);

			arrayRemove(this.collaborators, i => i.id === collaborator.id);

			if (!this.collaborators.length) {
				this.isShowingCollaboratorAdd = true;
			}
		} catch (e) {
			Growls.error(this.$gettext('Could not remove collaborator for some reason.'));
		}
	}

	showEditAvatar() {
		CommunityThumbnailModal.show(this.community);
	}
}