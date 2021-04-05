import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";
import { changeCollapse, loadSampleGameData, clearGameData, changeViewing, changeDetailPlayer, changeMode } from "../../../redux/actions/index";

import SettingsService from "../../../services/SettingsService";
import LocalizationService from "../../../services/LocalizationService";

class Menu extends React.Component {
	render() {
		return (
			<ContextMenu id="right-click-menu" className="container-context-menu">
				<div className="item-group">
					{this.getFirstSection()}
					{this.getSecondSection()}
					<MenuItem onClick={SettingsService.openSettingsWindow}>
						{LocalizationService.getOverlayText("settings")}
					</MenuItem>
					<MenuItem onClick={SettingsService.openSettingsImport}>
						{LocalizationService.getOverlayText("import")}
					</MenuItem>
					<div className="split"></div>
					<MenuItem onClick={this.changeMode.bind(this, "stats")}>
						Mode: Parser
					</MenuItem>
					<MenuItem onClick={this.changeMode.bind(this, "spells")}>
						Mode: Spell Timer
					</MenuItem>
				</div>
			</ContextMenu>
		);
	}

	getFirstSection() {
		let plugin_service = this.props.plugin_service;

		let collapse_item = () => {
			if (this.props.mode === "spells") {
				return "";
			}

			let text = LocalizationService.getOverlayText((this.props.collapsed) ? "uncollapse" : "collapse");
			let data = { state: !this.props.collapsed };

			return(
				<MenuItem key="menu-collapse" data={data} onClick={this.changeCollapse.bind(this)}>
					{text}
				</MenuItem>
			);
		};

		let plugin_actions = () => {
			if (this.props.mode === "spells") {
				return "";
			}

			return(
				<MenuItem key="menu-split-encounter" onClick={plugin_service.splitEncounter.bind(plugin_service)}>
					{LocalizationService.getOverlayText("split_encounter")}
				</MenuItem>
			);
		}

		let items = [collapse_item(), plugin_actions()].filter(x => !!x);

		if (items.length) {
			items.push(<div key="menu-group1-split" className="split"></div>);
		}

		return items;
	}

	getSecondSection() {
		let items = [];

		if (this.props.mode === "stats") {
			items.push(
				<MenuItem key="menu-view-encounter" onClick={this.changeViewing.bind(this, "player", this.props.encounter)}>
					{LocalizationService.getOverlayText("view_encounter")}
				</MenuItem>
			);
		}

		items.push(
			<MenuItem key="menu-load-sample" onClick={this.loadSampleGameData.bind(this)}>
				{LocalizationService.getOverlayText("load_sample")}
			</MenuItem>
		);
		items.push(
			<MenuItem key="menu-clear-encounter" onClick={this.clearGameData.bind(this)}>
				{LocalizationService.getOverlayText("clear_encounter")}
			</MenuItem>
		);
		items.push(<div key="menu-group2-split" className="split"></div>);
		return items;
	}

	changeCollapse(e, data) {
		this.props.changeCollapse(data.state);
	}

	loadSampleGameData() {
		this.props.loadSampleGameData();
	}

	clearGameData() {
		this.props.clearGameData();
	}

	changeMode(mode) {
		this.props.changeMode(mode);
	}

	changeViewing(type, player) {
		if (!player) {
			return;
		}

		this.props.changeViewing(type);
		this.props.changeDetailPlayer(player);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCollapse : (data) => {
			dispatch(changeCollapse(data));
		},

		loadSampleGameData : () => {
			dispatch(loadSampleGameData());
		},

		clearGameData : () => {
			dispatch(clearGameData());
		},

		changeViewing : (data) => {
			dispatch(changeViewing(data));
		},

		changeDetailPlayer : (data) => {
			dispatch(changeDetailPlayer(data));
		},

		changeMode : (data) => {
			dispatch(changeMode(data));
		},
	}
};

const mapStateToProps = (state) => {
	return {
		plugin_service : state.plugin_service,
		language       : state.settings.interface.language,
		collapsed      : state.settings.intrinsic.collapsed,
		overlayplugin  : state.internal.overlayplugin,
		encounter      : state.internal.game.Encounter,
		mode           : state.internal.mode,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);