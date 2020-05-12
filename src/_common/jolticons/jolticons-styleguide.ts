import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AppTooltip } from '../tooltip/tooltip';

@Component({
	directives: {
		AppTooltip,
	},
})
export default class AppJolticonsStyleguide extends Vue {
	filter = '';

	get filteredIcons() {
		return [
			'active',
			'add-box',
			'add-comment',
			'add',
			'arrow-forward',
			'arrows-h',
			'arrows-v',
			'arrows',
			'at-sign',
			'audio',
			'backward',
			'blockquote',
			'blog-article',
			'bold',
			'bolt-filled',
			'bolt-unfilled',
			'books',
			'box-empty',
			'box',
			'brackets',
			'broadcast',
			'bullet-list',
			'bundle',
			'calendar-check',
			'calendar-grid',
			'calendar-minus',
			'calendar-plus',
			'calendar-x',
			'calendar',
			'chart',
			'check',
			'checkbox',
			'chevron-down',
			'chevron-left',
			'chevron-right',
			'chevron-up',
			'claim',
			'client',
			'cog',
			'comment',
			'compass-needle',
			'compass',
			'credit-card',
			'dashboard',
			'devlogs',
			'download-box',
			'download',
			'edit',
			'ellipsis-h',
			'ellipsis-v',
			'email',
			'embed',
			'exclamation-circle',
			'exp',
			'facebook',
			'fast-backward',
			'fast-forward',
			'feed',
			'filter',
			'fireside',
			'flag',
			'flash',
			'folder-open',
			'folder',
			'forums',
			'forward',
			'friend-add-1',
			'friend-add-2',
			'friend-remove-1',
			'friend-remove-2',
			'friend-requests',
			'friends',
			'game',
			'gamejolt',
			'gif',
			'google',
			'h1',
			'h2',
			'help-circle',
			'help',
			'hr',
			'html5',
			'inactive',
			'indiedb',
			'info-circle',
			'insert-table',
			'italic',
			'itchio',
			'jams',
			'java',
			'key-diagonal',
			'link',
			'linux',
			'lock',
			'logout',
			'mac',
			'markdown',
			'menu',
			'mixer',
			'musical-note-double',
			'notice',
			'notifications',
			'numbered-list',
			'offline',
			'other-os',
			'pause',
			'pedestals-numbers',
			'play-small',
			'play',
			'playlist',
			'plug',
			'radio-circle-filled',
			'radio-circle',
			'reddit',
			'remove',
			'reply',
			'rom',
			'rss',
			'screenshot',
			'search',
			'share-airplane',
			'silverlight',
			'sketchfab',
			'soundcloud',
			'steam',
			'strikethrough',
			'subscribe',
			'subscribed',
			'tag',
			'tags',
			'thumbs-down',
			'thumbs-up',
			'thumbtack',
			'token',
			'trophy',
			'tumblr',
			'twitch',
			'twitter-bird',
			'twitter',
			'unity',
			'unlock',
			'user-messages',
			'user',
			'users',
			'verified',
			'video',
			'windows',
			'world',
			'youtube',
			'arrow-left',
			'arrow-right',
			'sticker',
			'fullscreen',
			'unfullscreen',
			'heart',
			'heart-filled',
		]
			.sort()
			.filter(i => i.indexOf(this.filter) !== -1);
	}
}
