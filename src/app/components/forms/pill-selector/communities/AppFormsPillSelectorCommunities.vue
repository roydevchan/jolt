<script lang="ts" setup>
import { computed, PropType, ref, toRefs } from 'vue';
import { CommunityChannel } from '../../../../../_common/community/channel/channel.model';
import { Community } from '../../../../../_common/community/community.model';
import AppCommunityThumbnailImg from '../../../../../_common/community/thumbnail/AppCommunityThumbnailImg.vue';
import AppCommunityVerifiedTick from '../../../../../_common/community/verified-tick/verified-tick.vue';
import AppJolticon from '../../../../../_common/jolticon/AppJolticon.vue';
import { Popper } from '../../../../../_common/popper/popper.service';
import { vAppTooltip } from '../../../../../_common/tooltip/tooltip-directive';
import AppFormsPillSelector from '../AppFormsPillSelector.vue';
import AppScrollHelper from '../AppScrollHelper.vue';
import AppFormsPillSelectorItem from '../_item/AppFormsPillSelectorItem.vue';

const props = defineProps({
	communities: {
		type: Array as PropType<Community[]>,
		required: true,
	},
	initialCommunity: {
		type: Object as PropType<Community | null>,
		default: null,
	},
	withChannel: {
		type: Boolean,
		default: true,
	},
});

const { communities, initialCommunity, withChannel } = toRefs(props);

const emit = defineEmits({
	selectCommunity: (_community: Community) => true,
	selectChannel: (_channel: CommunityChannel) => true,
	select: (_community: Community, _channel: CommunityChannel) => true,
});

const selectedCommunity = ref<Community | null>(null);

const channels = computed(() => selectedCommunity.value?.postableChannels);

const isInitial = computed(() => selectedCommunity.value === initialCommunity.value);

const shouldShowCommunitySelector = computed(() => !selectedCommunity.value || !withChannel.value);

resetSelections();

function unselectCommunity() {
	if (isInitial.value) {
		return;
	}

	selectedCommunity.value = null;
}

function selectCommunity(community: Community) {
	selectedCommunity.value = community;
	emit('selectCommunity', community);

	if (!withChannel.value) {
		_closeAndReset();
	}
}

function selectChannel(channel: CommunityChannel) {
	emit('selectChannel', channel);
	emit('select', selectedCommunity.value!, channel);
	_closeAndReset();
}

function resetSelections() {
	selectedCommunity.value = initialCommunity.value;
}

function _closeAndReset() {
	Popper.hideAll();
	selectedCommunity.value = initialCommunity.value;
}
</script>

<template>
	<AppFormsPillSelector>
		<slot />

		<template #header>
			<AppFormsPillSelectorItem
				v-if="selectedCommunity"
				is-header
				:has-header-back="!isInitial"
				@click="unselectCommunity"
			>
				<template #img>
					<AppCommunityThumbnailImg :community="selectedCommunity" />
				</template>

				<template #default>
					{{ selectedCommunity!.name }}
				</template>

				<template #tag>
					<AppCommunityVerifiedTick class="-tick" :community="selectedCommunity" small />
				</template>
			</AppFormsPillSelectorItem>
		</template>

		<template #popover>
			<AppScrollHelper :when="!!selectedCommunity" />
			<div v-if="shouldShowCommunitySelector" class="list-group">
				<AppFormsPillSelectorItem
					v-for="community of communities"
					:key="community.id"
					@click="selectCommunity(community)"
				>
					<template #img>
						<AppCommunityThumbnailImg :community="community" />
					</template>

					<template #default>
						{{ community.name }}
					</template>

					<template #tag>
						<AppCommunityVerifiedTick class="-tick" :community="community" small />
					</template>
				</AppFormsPillSelectorItem>
			</div>
			<div v-else class="-channels list-group">
				<template v-if="channels">
					<AppFormsPillSelectorItem
						v-for="channel of channels"
						:key="channel.id"
						no-img
						@click="selectChannel(channel)"
					>
						<template #default>
							<AppJolticon
								v-if="channel.type === 'competition'"
								v-app-tooltip="$gettext(`Game Jam`)"
								icon="jams"
							/>
							<AppJolticon
								v-if="channel.isUnpublished"
								v-app-tooltip="$gettext(`Channel is not publicly visible`)"
								icon="subscribed"
							/>

							{{ channel.displayTitle }}
						</template>
					</AppFormsPillSelectorItem>
				</template>
			</div>
		</template>
	</AppFormsPillSelector>
</template>