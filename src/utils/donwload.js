import { PermissionsAndroid, Platform } from 'react-native';
import translate from '@src/locales/i18n';
import RNFetchBlob from 'rn-fetch-blob';
import { Router } from '@src/Router';

/**
 * Downloads files
 * @param file
 * @param filename
 * @param encoding
 */
export const downloadFile = async (file, filename, encoding) => {
    if (Platform.OS === 'ios') {
        return saveFile(file, filename, 'ios', encoding);
    } else {
        return downloadAndroid(file, filename, encoding);
    }
};

const downloadAndroid = async (file, filename, encoding) => {
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(async value => {
        if (value) return saveFile(file, filename, 'android', encoding);
        else {
            const result = await requestWritePermission();
            if (result) {
                return saveFile(file, filename, 'android', encoding);
            } else {
                Router.showMessage({
                    message: translate('writePermissionsNeeded'),
                    type: 'danger'
                });
            }
        }
    });
};

const requestWritePermission = async (): Promise<boolean> => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: translate('CreateWallet.ShowQRCode.permissionTitle'),
            message: translate('CreateWallet.ShowQRCode.permissionMessage'),
            buttonNegative: translate('CreateWallet.ShowQRCode.permissionTextCancel'),
            buttonPositive: translate('CreateWallet.ShowQRCode.permissionTextOk'),
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        return false;
    }
};

const saveFile = async (data, filename, platform, encoding) => {
    const { dirs } = RNFetchBlob.fs;
    if (platform === 'android') {
        const exists = await RNFetchBlob.fs.exists(dirs.DownloadDir);
        if (!exists) await RNFetchBlob.fs.mkdir(dirs.DownloadDir);
    }
    return RNFetchBlob.fs
        .writeFile(`${platform === 'ios' ? dirs.DocumentDir : dirs.DownloadDir}/${filename}`, data, encoding)
        .then(() => {
            if (platform === 'ios') {
                RNFetchBlob.ios.previewDocument(`${dirs.DocumentDir}/${filename}`);
            } else {
                RNFetchBlob.android.actionViewIntent(`${platform === 'ios' ? dirs.DocumentDir : dirs.DownloadDir}/${filename}`, "application/pdf")
            }
            Router.showMessage({
                message: translate(
                    'unsortedKeys.fileSavedToDirectoryMessage',
                    {
                        folder: platform === 'ios' ? 'Documents' : 'Downloads'
                    }
                ),
                type: 'success'
            });
        })
        .catch(() => {
            Router.showMessage({
                message: translate('unsortedKeys.errorSavingFile'),
                type: 'danger',
            });
        });
};
