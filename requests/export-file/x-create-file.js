import XElement from "/libraries/x-element/x-element.js";
import WalletBackup from "/libraries/wallet-backup/wallet-backup.js";
import XDownloadableImage from "/elements/x-downloadable-image/x-downloadable-image.js";
import QrScanner from '/libraries/qr-scanner/qr-scanner.min.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XCreateFile extends MixinRedux(XElement) {

    html() {
        return `<x-downloadable-image></x-downloadable-image>`
    }

    children() {
        return [ XDownloadableImage ];
    }

    onCreate() {
        this.addEventListener('x-image-download', e => this._onImageDownload(e));
        super.onCreate();
    }

    static mapStateToProps(state) {
        return {
           encryptedKeyPair: state.request.data.encryptedKeyPair,
           address: state.request.data.address
        }
    }

    async _onPropertiesChanged(changes) {
        const { address } = this.properties;

        let { encryptedKeyPair } = changes;

        if (!encryptedKeyPair || !address) return;

        encryptedKeyPair = Nimiq.BufferUtils.toBase64(encryptedKeyPair);

        const qrPosition = WalletBackup.calculateQrPosition();

        let backup = null;
        let scanResult = null;

        // QR Scanner is not super reliable. Test if we can read the image we just created, if not, create a new one.
        do {
            backup = new WalletBackup(address, encryptedKeyPair);
            try {
                scanResult = await QrScanner.scanImage(backup.$canvas, qrPosition, null, null, false, true);
            } catch(e) { }
        } while (scanResult !== encryptedKeyPair);

        const filename = backup.filename();
        this.$downloadableImage.src = await backup.toDataUrl();
        this.$downloadableImage.filename = filename;
    }

    _onImageDownload(e) {
        e.stopPropagation();
        this.fire('x-file-download-complete');
    }
}
