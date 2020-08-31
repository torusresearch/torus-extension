import ObservableStore from "obs-store";
import ThresholdKey from "tkey"
import {
  SecurityQuestionsModule,
  ChromeExtensionStorageModule,
  TorusServiceProvider,
  TorusStorageLayer
} from "tkey";

export default class TkeyController {
  constructor(opts = {}) {
    const {
      createNewTorusVaultAndRestore,
      initState,
      importAccountWithStrategy
    } = opts;
    this.store = new ObservableStore(
      Object.assign(
        {
          rawtkey: {},
          rawShareDescription: null,
          shareDescriptions: null,
          postBox: {},
          keyDetails: {},
          tb: null,
          parsedShareDesc: {},
          settingsPageData: {}
        },
        initState
      )
    );

    this.tb = null;
    this.createNewTorusVaultAndRestore = createNewTorusVaultAndRestore;
    this.importAccountWithStrategy = importAccountWithStrategy;
  }

  /**
   * Torus google login
   */
  async torusGoogleLogin(newKeyAssign) {
    try {
      const TorusOptions = {
        GOOGLE_CLIENT_ID:
          "876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com",
        baseUrl: "https://scripts.toruswallet.io/",
        redirectPathName: "redirectChromeExtension.html"
        // baseUrl: 'https://toruscallback.ont.io/serviceworker',
      };

      const serviceProvider = new TorusServiceProvider({
        directParams: {
          GOOGLE_CLIENT_ID:
            "876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com",
          baseUrl: "https://scripts.toruswallet.io/",
          redirectPathName: "redirectChromeExtension.html",
          redirectToOpener: true,
          network: "mainnet",
        }
        // postboxKey:
        //   "f1f02ee186749cfe1ef8f957fc3d7a5b7128f979bacc10ab3b2a811d4f990852"
      });
      const storageLayer = new TorusStorageLayer({
        hostUrl: "https://metadata.tor.us",
        serviceProvider
      });
      this.tb = new ThresholdKey({
        modules: {
          securityQuestions: new SecurityQuestionsModule(),
          chromeExtensionStorage: new ChromeExtensionStorageModule()
        },
        serviceProvider,
        storageLayer
      });

      await this.tb.serviceProvider.directWeb.init({ skipSw: true });

      // Login via torus service provider to get back 1 share
      // following returns a postbox key
      this.postBox = await this.tb.serviceProvider.triggerLogin({
        clientId: TorusOptions.GOOGLE_CLIENT_ID,
        typeOfLogin: "google",
        verifier: "google"
      });

      let postBox = this.postBox;
      let verifierId = postBox.userInfo.email;
      this.userInfo = postBox.userInfo;
      this.store.updateState({ postBox: postBox });

      // Allowing option keyassign for development purposes
      let keyDetails;
      if (newKeyAssign) {
        await this.tb.initializeNewKey({ initializeModules: true });
        keyDetails = this.tb.getKeyDetails();
        // await this.torusAddPasswordShare("torusAddPasswordShare");
      } else {
        keyDetails = await this.tb.initialize();
      }
      this.store.updateState({ keyDetails });
      await this.setSettingsPageData();

      // Check different types of shares from metadata. This helps in making UI decisions (About what kind of shares to ask from users)
      // Sort the share descriptions with priority order
      let priorityOrder = [
        "chromeExtensionStorage",
        "securityQuestions",
      ];

      let shareDesc = this.store.getState().parsedShareDesc;
      let tempSD = Object.values(shareDesc)
        .flatMap(x => x)
        .sort((a, b) => {
          return (
            priorityOrder.indexOf(a.module) - priorityOrder.indexOf(b.module)
          );
        });
      let requiredShares = keyDetails.requiredShares;
      while (requiredShares > 0) {
        /**
         * Priority while importing required Shares
         * 1. chromeExtensionStorage
         * 2. Password
         * 3. Otherdevices
         * 4. SQs
         */

        let currentPriority = tempSD.shift();
        if (currentPriority.module === "chromeExtensionStorage") {
          try {
            await this.tb.modules.chromeExtensionStorage.inputShareFromChromeExtensionStorage();
            requiredShares--;
          } catch (err) {
            console.log("Couldn't find on device share");
          }
        } else if (currentPriority.module === "securityQuestions") {
          // default to password for now
          throw "Password required";
        }

        if (tempSD.length === 0 && requiredShares > 0) {
          throw "new key assign required";
        }
      }

      await this.reconstructTorusKeyrings();
      // debugger
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async reconstructTorusKeyrings() {
    try {
      // Reconstruct the private key again
      // Exposed on metamask controller for development purposes. delete later.
      let reconstructedKey = await this.tb.reconstructKey();
      reconstructedKey = reconstructedKey.toString("hex").padStart(64, "0");
      this.tempPrivateKey = reconstructedKey; // dev purposes

      //add threshold back key with empty password
      await this.createNewTorusVaultAndRestore("", reconstructedKey, {
        ...this.postBox.userInfo,
        typeOfLogin: "2FA Wallet"
      });

      // import this.postbox key
      await this.importAccountWithStrategy(
        "Private Key",
        [this.postBox.privateKey],
        this.postBox.userInfo
      );

      await this.setSettingsPageData();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  async torusInputPasswordShare(password) {
    // add new share
    try {
      await this.tb.modules.securityQuestions.inputShareFromSecurityQuestions(
        password,
        "what is your password?"
      );
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  async torusChangePasswordShare(password) {
    try {
      await this.tb.modules.securityQuestions.changeSecurityQuestionAndAnswer(
        password,
        "what is your password?"
      );
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  async torusAddPasswordShare(password) {
    // add new share
    try {
      await this.tb.modules.securityQuestions.generateNewShareWithSecurityQuestions(
        password,
        "what is your password?"
      );
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  async setSettingsPageData() {
    let tkey = this.tb;
    let onDeviceShare = {},
      passwordShare = {};

    let keyDetails = this.tb.getKeyDetails();
    let shareDesc = Object.assign({}, keyDetails.shareDescriptions);
    Object.keys(shareDesc).map(el => {
      shareDesc[el] = shareDesc[el].map(jl => {
        return JSON.parse(jl);
      });
    });
    this.store.updateState({
      parsedShareDesc: shareDesc,
      keyDetails: keyDetails
    });
    let parsedShareDesc = shareDesc;

    // Total device shares
    let allDeviceShares = this.getTotalDeviceShares();

    // For ondevice share
    try {
      let el = await tkey.modules.chromeExtensionStorage.getStoreFromChromeExtensionStorage();
      if (el) {
        onDeviceShare.available = true;
        onDeviceShare.share = el;
      }
    } catch {
      onDeviceShare.available = false;
    }

    // password share
    let passwordModules = Object.values(parsedShareDesc)
      .flatMap(x => x)
      .filter(el => el.module == "securityQuestions");
    passwordShare.available = passwordModules.length > 0 ? true : false;

    // Current threshold
    let threshold = keyDetails.threshold + "/" + keyDetails.totalShares;

    let { postBox } = this.store.getState();
    this.store.updateState({
      settingsPageData: {
        serviceProvider: {
          available: tkey.serviceProvider.postboxKey !== "0",
          verifierId: postBox.userInfo.email
        },
        deviceShare: onDeviceShare,
        allDeviceShares: allDeviceShares,
        passwordShare: passwordShare,
        tkey: tkey,
        threshold: threshold
      }
    });
  }

  async getTkeyDataForSettingsPage() {
    await this.setSettingsPageData();
    let el = this.store.getState().settingsPageData;
    return el;
  }

  getTotalDeviceShares() {
    // Avoid modifying this.tb
    const { parsedShareDesc } = this.store.getState();
    let shareDesc = Object.assign({}, parsedShareDesc);
    Object.keys(shareDesc).map(el => {
      shareDesc[el] = shareDesc[el].filter(
        el =>
          el.module === "chromeExtensionStorage" || el.module === "webStorage"
      );
    });
    return shareDesc;
  }

  async copyShareUsingIndexAndStoreLocally(index) {
    let outputshare = this.tb.outputShare(index);
    this.tb.modules.chromeExtensionStorage.storeDeviceShare(outputshare);
    this.store.updateState({ keyDetails: this.tb.getKeyDetails() });
    await this.setSettingsPageData();
    // store locally
  }

  async generateAndStoreNewDeviceShare() {
    try {
      let newShare = await this.tb.generateNewShare();
      this.tb.modules.chromeExtensionStorage.storeDeviceShare(
        newShare.newShareStores[newShare.newShareIndex.toString("hex")]
      );
      this.store.updateState({ keyDetails: this.tb.getKeyDetails() });
      await this.setSettingsPageData();
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async deleteShareDescription(shareIndex, desc) {
    try {
      await this.tb.deleteShareDescription(shareIndex, desc, true);
      this.store.updateState({ keyDetails: this.tb.getKeyDetails() });
      await this.setSettingsPageData();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}