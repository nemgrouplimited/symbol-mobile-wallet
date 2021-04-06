import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddressBook } from 'symbol-address-book/AddressBook';

type Type = 'address' | 'mosaicId' | 'namespaceName';

interface Props {
    type: Type;
    addressBook: AddressBook;
}

class Transaction extends Component<Props> {
    formatAddress = address => {
        const { addressBook } = this.props;
        const contact = addressBook.getContactByAddress(address);
        return contact ? contact.name : this.trunc(address, 'middle', 6, 3);
    };

    trunc = (text, cut, lengthFirst, lengthSecond) => {
        if (cut === 'middle' && lengthFirst + lengthSecond < text.length) {
			return text.substring(0, lengthFirst) + '...' + text.substring(text.length - lengthSecond, text.length);
		}
        if (cut === 'end' && lengthFirst < text.length) {
			return text.substring(0, lengthFirst) + '...';
		}

		return text;
    };

    render = () => {
        const { type, length = 5, children } = this.props;
        if (typeof children !== 'string') {
            console.error(`Failed to trunc text. ${typeof children} is not a "string"`);
            return '';
        }
        switch (type) {
            case 'address':
                return this.formatAddress(children);
            case 'mosaicId':
                return this.trunc(children, 'middle', 6, 3);
            case 'namespaceName':
                return this.trunc(children, 'middle', 6, 6);
            default:
                return this.trunc(children, 'end', length);
        }
    };
}

export default connect(state => ({
    addressBook: state.addressBook.addressBook,
}))(Transaction);
