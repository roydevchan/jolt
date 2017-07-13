import Vue from 'vue';
import VueRouter from 'vue-router';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./list.html';

import { RouteResolve } from '../../../../../../../../lib/gj-lib-client/utils/router';
import { GamePackage } from '../../../../../../../../lib/gj-lib-client/components/game/package/package.model';
import { Meta } from '../../../../../../../../lib/gj-lib-client/components/meta/meta-service';
import { RouteState, RouteStore } from '../../../manage.state';
import { arrayIndexBy } from '../../../../../../../../lib/gj-lib-client/utils/array';
import { Sellable } from '../../../../../../../../lib/gj-lib-client/components/sellable/sellable.model';
import { ModalConfirm } from '../../../../../../../../lib/gj-lib-client/components/modal/confirm/confirm-service';
import { Growls } from '../../../../../../../../lib/gj-lib-client/components/growls/growls.service';
import { Api } from '../../../../../../../../lib/gj-lib-client/components/api/api.service';
import { AppJolticon } from '../../../../../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppTooltip } from '../../../../../../../../lib/gj-lib-client/components/tooltip/tooltip';
import { currency } from '../../../../../../../../lib/gj-lib-client/vue/filters/currency';
import { AppCardList } from '../../../../../../../../lib/gj-lib-client/components/card/list/list';
import { AppCardListDraggable } from '../../../../../../../../lib/gj-lib-client/components/card/list/draggable/draggable';
import { AppCardListItem } from '../../../../../../../../lib/gj-lib-client/components/card/list/item/item';
import { AppDashGameWizardControls } from '../../../../../../../components/forms/game/wizard-controls/wizard-controls';

@View
@Component({
	components: {
		AppJolticon,
		AppCardList,
		AppCardListDraggable,
		AppCardListItem,
		AppDashGameWizardControls,
	},
	directives: {
		AppTooltip,
	},
	filters: {
		currency,
	},
})
export default class RouteDashGamesManageGamePackagesList extends Vue {
	@RouteState game: RouteStore['game'];

	packages: GamePackage[] = [];
	sellables: { [x: number]: Sellable } = {};

	GamePackage = GamePackage;

	get packagesSort() {
		return this.packages.map(i => i.id);
	}

	@RouteResolve()
	routeResolve(this: undefined, route: VueRouter.Route) {
		// TODO
		// if (!packagesPayload.packages.length) {
		// 	$state.go('dash.games.manage.game.packages.add', $stateParams);
		// }

		return Api.sendRequest(
			'/web/dash/developer/games/packages/' + route.params.id
		);
	}

	routed() {
		Meta.title = this.$gettextInterpolate('Manage Packages for %{ game }', {
			game: this.game.title,
		});

		this.packages = GamePackage.populate(this.$payload.packages);
		this.sellables = arrayIndexBy<Sellable>(
			Sellable.populate(this.$payload.sellables),
			'game_package_id'
		);
	}

	saveSort() {
		// var newPackagesSort = _.pluck(_this.packages, 'id');
		// if (!angular.equals(newPackagesSort, _this.packagesSort)) {
		// 	_this.packagesSort = newPackagesSort;
		// 	Game_Package.$saveSort(manageCtrl.game.id, _this.packagesSort);
		// }
	}

	async removePackage(pkg: GamePackage) {
		const result = await ModalConfirm.show(
			this.$gettext(
				'Are you sure you want to remove this package? All of the releases and builds it contains will be removed as well.'
			)
		);

		if (!result) {
			return;
		}

		await pkg.$remove(this.game);

		Growls.success(
			this.$gettext('The game package has been removed.'),
			this.$gettext('Package Removed')
		);

		// We have to do a refresh since a new package may have been chosen as the primary sellable.
		// TODO
		// $state.reload($state.current);
	}
}
