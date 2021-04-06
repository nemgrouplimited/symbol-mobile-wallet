import React, { Component } from 'react';
import { 
	StyleSheet, 
	Text,
} from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Dropdown, Row, Input } from '@src/components';
import translate from '@src/locales/i18n';

const styles = StyleSheet.create({
	name: {
		fontSize: 12,
		fontFamily: 'NotoSans-SemiBold',
		fontWeight: '400'
	},
	balance: {
		fontSize: 12,
		color: GlobalStyles.color.GREY3
	},
    input: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 0
    }
});


interface Props {

};
type State = {
    customNodeUrlInput: string;
    isInvalidUrl: Boolean;
};


export default class MosaicDropdown extends Component<Props, State> {
    state = {
        customNodeUrlInput: '',
        isInvalidUrl: false
    };

    constructor(props) {
        super(props);
        this.dropdown = React.createRef();
    };

	renderItem = (item) => {
		return (
			<Row style={styles.root} justify ="space-between">
				<Text style={styles.name}>
					{item.label}
				</Text>
				<Text style={styles.balance}>
					{item.balance}
				</Text>
			</Row>
		);
	};

    renderModalInner = () => {
        return (
            <Input
                value={this.state.customNodeUrlInput}
                placeholder={translate('Settings.node.costomNode')}
                nativePlaceholder={translate('Settings.node.customNodeURLInputPlaceholder')}
                errorMessage={translate('Settings.node.errorInvalidUrl')}
                isError={this.state.isInvalidUrl}
                showSubmit={!this.state.isInvalidUrl && this.state.customNodeUrlInput.length}
                theme="light"
                style={styles.input}
                onChangeText={text => this.onChangeText(text)}
                onSubmitEditing={() => this.onSubmit()}
            /> 
        );
    };

    onChangeText = (nodeUrl) => {
        const validUrl = /^((https?:\/\/))[\w-]+(\.[\w-]+)+\.?:(3000)$/gm.test(nodeUrl);
        this.setState({
            customNodeUrlInput: nodeUrl,
            isInvalidUrl: !validUrl
        });
    };

    clearCustomNodeUrlInput = () => {
        this.setState({
            customNodeUrlInput: '',
            isInvalidUrl: false
        });
    }

    onSubmit = () => {
        if (!this.state.isInvalidUrl && this.state.customNodeUrlInput.length) {
            this.props.onChange(this.state.customNodeUrlInput);
            this.dropdown.current.closeSelector();
        }
    };

    render = () => {
		const { ...rest } = this.props;

        return <Dropdown 
            modalInnerRenderer={this.renderModalInner}
            onOpenSelector={this.clearCustomNodeUrlInput}
            onCloseSelector={this.clearCustomNodeUrlInput}
            inputStyle={{borderWidth: 1}}
            ref={this.dropdown} 
            {...rest} 
        />
    };
}
