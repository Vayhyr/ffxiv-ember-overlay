import React from "react";
import { connect } from "react-redux";
import { changeCollapse } from "../../redux/actions/index";
import { Icon } from "semantic-ui-react";

class GameState extends React.Component {
	render() {
		let encounter_class = (this.props.active) ? "active" : "inactive";
		let rank_class      = (this.props.show_rank) ? "" : "hidden";
		let collapse_item   = () => {
			let icon = (this.props.collapsed) ? "expand" : "compress";
			let data = { state: !this.props.collapsed };

			return(
				<div className="icon-container" onClick={this.changeCollapse.bind(this, data)}>
					<Icon name={icon} alt="Toggle collapse" title="Toggle collapse"/>
				</div>
			);
		};

		return (
			<div id="game-state">
				<span className={encounter_class}>{this.props.state}</span>
				<span>
					<span className={rank_class}>{this.props.rank}</span>
					{collapse_item()}
				</span>
			</div>
		);
	}

	changeCollapse(data) {
		this.props.changeCollapse(data.state);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCollapse : (data) => {
			dispatch(changeCollapse(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		collapsed : state.settings.intrinsic.collapsed
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameState);