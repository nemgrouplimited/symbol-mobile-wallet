import { Address, IListener, RepositoryFactoryHttp } from 'symbol-sdk';
import type { AccountModel } from '@src/storage/models/AccountModel';
import type { NetworkModel } from '@src/storage/models/NetworkModel';
import AccountService from '@src/services/AccountService';
import { showMessage } from 'react-native-flash-message';
import { Router } from '@src/Router';
import store from '@src/store';

export default class ListenerService {
    network: NetworkModel;
    listener: IListener;

    setNetwork = (network: NetworkModel) => {
        if (this.listener) {
            this.listener.close();
        }
        this.network = network;
        const repositoryFactory = new RepositoryFactoryHttp(network.node, {
            websocketInjected: WebSocket,
        });
        this.listener = repositoryFactory.createListener();
    };

    listen = (account: AccountModel) => {
        this.listener.close();
        const rawAddress = AccountService.getAddressByAccountModelAndNetwork(account, this.network.type);
        const address = Address.createFromRawAddress(rawAddress);
        this.listener.open().then(() => {
            console.log('Listening ' + address.pretty());
            this.listener
                .confirmed(address)
                //.pipe(filter(transaction => transaction.transactionInfo !== undefined))
                .subscribe(() => {
                    this.showMessage('New confirmed transaction!', 'success');
                    store.dispatchAction({ type: 'account/loadAllData' });
                });

            this.listener
                .unconfirmedAdded(address)
                //.pipe(filteser(transaction => transaction.transactionInfo !== undefined))
                .subscribe(() => {
                    this.showMessage('New unconfirmed transaction!', 'success');
                });
        });
    };

    showMessage = (message: string, type: 'danger' | 'warning' | 'success' = 'success') => {
        Router.showFlashMessageOverlay().then(() => {
            showMessage({
                message: message,
                type: type,
            });
        });
    };
}
