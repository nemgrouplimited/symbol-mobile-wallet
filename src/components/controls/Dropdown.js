import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, FlatList, ActivityIndicator } from 'react-native';
import GlobalStyles from '@src/styles/GlobalStyles';
import { Icon, Row, Text as AdvancedText, Trunc } from '@src/components';
import TitleBar from '@src/components/atoms/TitleBar';

const styles = StyleSheet.create({
    root: {
        //backgroundColor: '#f005',
	},
	titleBar: {
		marginTop: 12
	},
    fullWidth: {
        width: '100%',
    },
    titleLight: {
        color: GlobalStyles.color.GREY3,
    },
    titleDark: {
        color: GlobalStyles.color.WHITE,
    },
    placeholder: {
        fontSize: 12,
        opacity: 0.3,
    },
    input: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    inputText: {
        fontSize: 12,
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '300',
    },
    inputLight: {
        //borderWidth: 1,
        borderRadius: 5,
        borderColor: GlobalStyles.color.GREY5,
        color: GlobalStyles.color.GREY1,
        backgroundColor: GlobalStyles.color.DARKWHITE,
        backgroundColor: GlobalStyles.color.WHITE,
    },
    inputDark: {
        borderRadius: 6,
        color: GlobalStyles.color.PRIMARY,
        backgroundColor: GlobalStyles.color.WHITE,
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        padding: 34,
        height: '100%',
        justifyContent: 'center',
    },
    modal: {
        maxHeight: '80%',
        width: '100%',
        backgroundColor: GlobalStyles.color.DARKWHITE,
        opacity: 0.95,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitleContainer: {
        borderBottomWidth: 1,
        borderColor: GlobalStyles.color.GREY4,
    },
    modalTitleText: {
        color: GlobalStyles.color.onLight.TEXT,
        fontFamily: 'NotoSans-SemiBold',
        fontSize: 18,
    },
    listItem: {
        //borderBottomWidth: 1,
        borderColor: GlobalStyles.color.onLight.TEXT,
        padding: 12,
    },
    listItemText: {
        textAlign: 'center',
        color: GlobalStyles.color.PRIMARY,
    },
    listItemTextActive: {
        fontFamily: 'NotoSans-SemiBold',
        fontWeight: '400',
    },
    loading: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 45,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.3,
    },
});

type Theme = 'light' | 'dark';

type ListItem = {
    value: string | number | Boolean,
    label: string,
};

interface Props {
    fullWidth: boolean;
    theme: Theme;
    list: ListItem[];
    title: String;
    customInputReneder: (item: Object) => void;
    customItemReneder: (item: Object) => void;
    modalInnerRenderer: (item: Object) => void;
    onOpenSelector: () => void;
    onCloseSelector: () => void;
}

type State = {};

export default class Dropdown extends Component<Props, State> {
    state = {
        isSelectorOpen: false,
    };

    getselectedOption = (value, list) => {
        const selectedOption = list.find(el => el.value === value);
        return !!selectedOption ? selectedOption : (value ? { label: value, value } : null);
    };

    getIconPosition = (k, offset) => {
        return {
            right: offset,
            width: k,
        };
    };

    getInputStyle = (k, offset) => {
        return {
            paddingRight: k + offset,
        };
    };

    openSelector = () => {
        this.setState({ isSelectorOpen: true });
        typeof this.props.onOpenSelector === 'function' && this.props.onOpenSelector();
    };

    closeSelector = () => {
        this.setState({ isSelectorOpen: false });
        typeof this.props.onCloseSelector === 'function' && this.props.onCloseSelector();
    };

    onChange = value => {
        if (typeof this.props.onChange === 'function') this.props.onChange(value);
        this.closeSelector();
    };

    renderItem = item => {
        const { customItemReneder } = this.props;
        const isActive = this.props.value === item.item.value;
        const textStyles = [styles.listItemText];
        if (isActive) textStyles.push(styles.listItemTextActive);

        return (
            <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.item.value)}>
                {!customItemReneder ? <Text style={textStyles}>{item.item.label}</Text> : customItemReneder({ ...item.item, isActive, isListItem: true })}
            </TouchableOpacity>
        );
    };

    render = () => {
        const {
            style = {},
            inputStyle = {},
            theme,
            fullWidth,
            list = [],
            value,
            placeholder = 'Please select..',
            title,
            customInputReneder,
            customItemReneder,
            isLoading,
            modalInnerRenderer,
            children,
            ...rest
        } = this.props;
        const { isSelectorOpen } = this.state;
        let inputStyles = [];
        let titleStyle = {};
        let rootStyle = [styles.root, style];
        const iconSize = 'small';
        const iconWrapperWidth = 30;
        const iconOffset = 8;
        const selectedOption = this.getselectedOption(value, list);

        if (fullWidth) rootStyle.push(styles.fullWidth);

        inputStyles.push(styles.input);
        if (theme === 'light') {
            inputStyles.push(styles.inputLight);
            titleStyle = styles.titleLight;
        } else {
            inputStyles.push(styles.inputDark);
            titleStyle = styles.titleDark;
        }

        inputStyles.push(this.getInputStyle(iconWrapperWidth, iconOffset));
        inputStyles.push(inputStyle);

        if (isLoading) inputStyles.push(styles.disabled);

        return (
            <View style={rootStyle}>
                {!children && <Text style={titleStyle}>{title}</Text>}
                {!children && (
                    <TouchableOpacity style={inputStyles} onPress={() => !isLoading && this.openSelector()}>
                        {selectedOption &&
                            (!customInputReneder 
                                ? <Text style={styles.inputText}>
                                    <Trunc length={36}>{selectedOption.label}</Trunc>
                                </Text> 
                                : customInputReneder(selectedOption)
                            )
                        }
                        {!selectedOption && <Text style={styles.placeholder}>{placeholder}</Text>}
                        <View style={[styles.icon, this.getIconPosition(iconWrapperWidth, iconOffset)]}>
                            <Icon name="expand" size={iconSize} />
                        </View>
                    </TouchableOpacity>
                )}
                {children && <TouchableOpacity onPress={() => this.openSelector()}>{children}</TouchableOpacity>}

                <Modal animationType="fade" transparent visible={isSelectorOpen} onRequestClose={() => this.closeSelector()}>
                    <TouchableWithoutFeedback onPress={() => this.closeSelector()}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalWrapper}>
                        <View style={styles.modal}>
                            <Row justify="center" style={styles.modalTitleContainer}>
                                <TitleBar
                                    style={styles.titleBar}
                                    titleTextStyle={styles.titleText}
                                    onClose={() => this.closeSelector()}
                                    iconStyle={styles.backButton}
                                    showClose={true}
                                    title={title}
                                    alignLeft
                                />
                            </Row>
                            {!!list.length && <FlatList data={list} renderItem={this.renderItem} keyExtractor={item => item.value} />}
                            {!list.length && !modalInnerRenderer && (
                                <AdvancedText type="regular" align="center" theme="light">
                                    Nothing to show
                                </AdvancedText>
                            )}
                            {!!modalInnerRenderer && modalInnerRenderer()}
                        </View>
                    </View>
                </Modal>
                {isLoading && <ActivityIndicator size="small" color={GlobalStyles.color.PINK} style={styles.loading} />}
            </View>
        );
    };
}
