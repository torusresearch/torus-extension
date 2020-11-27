import ObservableStore from 'obs-store'
import BN from 'bn.js'
import ThresholdKey from '@tkey/default'
import TorusServiceProvider from '@tkey/service-provider-torus'
import TorusStorageLayer from '@tkey/storage-layer-torus'
import SecurityQuestionsModule from '@tkey/security-questions'
import ShareTransferModule from '@tkey/share-transfer'
import ChromeExtensionStorageModule from '@tkey/chrome-storage'
import { MetamaskSeedPhraseFormat, SeedPhraseModule } from '@tkey/seed-phrase'
import { SECP256k1Format, PrivateKeyModule } from '@tkey/private-keys'

export default class TkeyController {
  constructor (opts = {}) {
    const {
      createNewTorusVaultAndRestore,
      initState,
      importAccountWithStrategy,
    } = opts
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
          settingsPageData: {},
        },
        initState
      )
    )

    this.mocked = true
    this.tb = null
    this.createNewTorusVaultAndRestore = createNewTorusVaultAndRestore
    this.importAccountWithStrategy = importAccountWithStrategy
  }

  /**
   * Torus google login
   */
  async torusGoogleLogin (newKeyAssign) {
    try {
      // const TorusOptions = {
      //   GOOGLE_CLIENT_ID:
      //     '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
      //   baseUrl: 'https://scripts.toruswallet.io/',
      //   redirectPathName: 'redirectChromeExtension.html',
      // }

      const metamaskSeedPhraseFormat = new MetamaskSeedPhraseFormat('https://mainnet.infura.io/v3/bca735fdbba0408bb09471e86463ae68')
      const seedPhraseModule = new SeedPhraseModule([metamaskSeedPhraseFormat])
      const serviceProvider = new TorusServiceProvider({
        directParams: {
          baseUrl: 'https://scripts.toruswallet.io/',
          redirectPathName: 'redirectChromeExtension.html',
          redirectToOpener: true,
          network: 'mainnet',
        },
        // postboxKey:
        //   'f1f02ee186749cfe1ef8f957fc3d7a5b7128f979bacc10ab3b2a811d4f990852',
      })
      const storageLayer = new TorusStorageLayer({
        hostUrl: 'https://metadata.tor.us',
        serviceProvider,
      })
      this.tb = new ThresholdKey({
        modules: {
          securityQuestions: new SecurityQuestionsModule(),
          chromeExtensionStorage: new ChromeExtensionStorageModule(),
          shareTransfer: new ShareTransferModule(),
          seedPhraseModule: seedPhraseModule,
          privateKeyModule: new PrivateKeyModule([new SECP256k1Format()]),
        },
        serviceProvider,
        storageLayer,
      })

      await this.tb.serviceProvider.directWeb.init({ skipSw: true })

      // Login via torus service provider to get back 1 share
      // following returns a postbox key
      // this.postBox = await this.tb.serviceProvider.triggerLogin({
      //   clientId: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
      //   typeOfLogin: 'google',
      //   verifier: 'google',
      // })

      const hybridObject = await this.tb.serviceProvider.triggerHybridAggregateLogin({
        singleLogin: {
          clientId: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
          typeOfLogin: 'google',
          verifier: 'google',
        },
        aggregateLoginParams: {
          aggregateVerifierType: 'single_id_verifier',
          verifierIdentifier: 'tkey-google',
          subVerifierDetailsArray: [
            {
              clientId: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
              typeOfLogin: 'google',
              verifier: 'torus',
            },
          ],
        },
      })
      this.postBox = hybridObject.singleLogin // for backward compatibility


      // // Delete postbox later. Strictly for development purposes.
      // this.postBox = {
      //   publicAddress: '0x9fbef084FB345721e3eC057Bd91bF050f3fb84dE',
      //   privateKey:
      //     'f1f02ee186749cfe1ef8f957fc3d7a5b7128f979bacc10ab3b2a811d4f990852',
      //   userInfo: {
      //     email: 'shubham@tor.us',
      //     name: 'Shubham Rathi',
      //     profileImage:
      //     // 'https://lh4.googleusercontent.com/-O_RR-ZbT0eU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck7BGhdFHYtK_ASzOMpfZSIeGScfg/photo.jpg',
      //       'https://savageuniversal.com/wp-content/uploads/2016/04/KyleG-Travis-Curry-01-3-1080x675.jpg',
      //     verifier: 'google-shubs',
      //     verifierId: 'shubham@tor.us',
      //     typeOfLogin: 'google',
      //     accessToken:
      //         'ya29.a0AfH6SMBiDCcm-nQMnifShrYJ606p6g5EY_5PHpXpamrNuAN_D2qWBk4p-9XgNhhPlXHT808UaKvexUQFtUEf1Ajk6OyLWcGxEv4a8GwqXCDSQ8LzRK50OU29capbmMwxkwDi1br0MWjiIAaze5ZZAl7NQSrX9dVYAEA',
      //     idToken:
      //         'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwNTQxNWIxM2FjYjk1OTBmNzBkZjg2Mjc2NWM2NTVmNWE3YTAxOWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMzg5NDE3NDY3MTMtcXFlNGE3cmR1dWsyNTZkOG9pNWwwcTM0cXR1OWdwZmcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMzg5NDE3NDY3MTMtcXFlNGE3cmR1dWsyNTZkOG9pNWwwcTM0cXR1OWdwZmcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk1ODQzNTA5MTA3Mjc0NzAzNDkiLCJoZCI6InRvci51cyIsImVtYWlsIjoic2h1YmhhbUB0b3IudXMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlFEUDI1Z1VqNDRNNVRZdFBQVGhHSlEiLCJub25jZSI6InhXYjZ1WldJbmQ5cGlYdDRiRXpPY1g4UklQbWdJaSIsIm5hbWUiOiJTaHViaGFtIFJhdGhpIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tT19SUi1aYlQwZVUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjazdCR2hkRkhZdEtfQVN6T01wZlpTSWVHU2NmZy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiU2h1YmhhbSIsImZhbWlseV9uYW1lIjoiUmF0aGkiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU5NjcwNTgzMCwiZXhwIjoxNTk2NzA5NDMwLCJqdGkiOiI1Y2Q0ZDQ3ZDAxYzliYjBmZmQ4ZDhlOTRhNzBkMWI0NDBmNTNhN2UwIn0.yKFXqJVoKleZTt8eXbuQYvpWr1ZPBVx880AeeBG-PZzmoE5_6OjTEe_b_VX4Ks-bSg3O2mFnVGAbgsK-GHKTmTUii_Ck_xVuGQJpRKTotJMxcyMUP9pXzs7sut21X08KQpouIeX4H0Wz-uWYQub1JAI7TZ41y3lxddAaI6-HR729zv1lfy2y42qLMNqllUsJpu-ItBwV1kdZuHg-ipxUDCq6n4JQkzOi3CyF69YJp6u6VVXcY857tyYbJTHfoLYzUZKVTzNB33A0rayg4x_mkNMle1c14GFOrzEH1gfOFR2a-H7F8jD8q2ShweyWWXcrl5mQx0GNGaUnXOVYTJVNgQ',
      //   },
      // }


      const postBox = this.postBox
      // const verifierId = postBox.userInfo.email
      this.userInfo = postBox.userInfo
      this.store.updateState({ postBox: postBox })

      // Allowing option keyassign for development purposes
      let keyDetails
      if (newKeyAssign) {
        await this.tb.initializeNewKey({ initializeModules: true })
        keyDetails = this.tb.getKeyDetails()
        // await this.torusAddPasswordShare("torusAddPasswordShare");
      } else {
        keyDetails = await this.tb.initialize()
      }
      this.store.updateState({ keyDetails })
      await this.setSettingsPageData()

      // Check different types of shares from metadata. This helps in making UI decisions (About what kind of shares to ask from users)
      // Sort the share descriptions with priority order
      const priorityOrder = [
        'chromeExtensionStorage',
        'securityQuestions',
        'webStorage',
      ]

      const shareDesc = this.store.getState().parsedShareDesc
      const tempSD = Object.values(shareDesc)
        .flatMap((x) => x)
        .sort((a, b) => {
          return (
            priorityOrder.indexOf(a.module) - priorityOrder.indexOf(b.module)
          )
        })
      let requiredShares = keyDetails.requiredShares
      while (requiredShares > 0) {
        /**
         * Priority while importing required Shares
         * 1. chromeExtensionStorage
         * 2. Password
         * 3. Otherdevices
         * 4. SQs
         */

        const currentPriority = tempSD.shift()
        if (currentPriority.module === 'chromeExtensionStorage') {
          try {
            await this.tb.modules.chromeExtensionStorage.inputShareFromChromeExtensionStorage()
            requiredShares--
          } catch (err) {
            console.log("Couldn't find on device share")
          }
        } else if (currentPriority.module === 'securityQuestions') {
          // default to password for now
          throw new Error('Password required')
        } else if (currentPriority.module === 'webStorage') {
          // Transfer share from another device
          throw new Error('Share transfer required')
        }

        if (tempSD.length === 0 && requiredShares > 0) {
          throw new Error('new key assign required')
        }
      }

      await this.reconstructTorusKeyrings()
      // debugger
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  async reconstructTorusKeyrings () {
    try {
      // Reconstruct the private key again
      // Exposed on metamask controller for development purposes. delete later.
      const reconstructedKey = await this.tb.reconstructKey()
      // console.log(reconstructedKey)
      const privKey = reconstructedKey.privKey.toString('hex').padStart(64, '0')
      // this.tempPrivateKey = privKey; // dev purposes

      const { postBox } = this.store.getState()

      const seedPhraseKeys = reconstructedKey.seedPhraseModule
      const privateKeys = reconstructedKey.privateKeyModule
      console.log(seedPhraseKeys, privateKeys)
      // add threshold back key with empty password
      await this.createNewTorusVaultAndRestore('', privKey, {
        ...postBox.userInfo,
        typeOfLogin: 'tKey',
      })

      // Private keys
      for (let index = 0; index < privateKeys.length; index++) {
        const element = privateKeys[index]
        await this.importAccountWithStrategy(
          'Private Key',
          [element.toString('hex').padStart(64, '0')],
          { typeOfLogin: 'Private key' }
        )
      }

      // Seed phrases
      for (let index = 0; index < seedPhraseKeys.length; index++) {
        const element = seedPhraseKeys[index]
        await this.importAccountWithStrategy(
          'Private Key',
          [element.toString('hex').padStart(64, '0')],
          { typeOfLogin: 'Seed phrase' }
        )
      }

      // import postbox key
      await this.importAccountWithStrategy(
        'Private Key',
        [postBox.privateKey],
        postBox.userInfo
      )

      await this.setSettingsPageData()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  async torusInputPasswordShare (password) {
    // add new share
    try {
      await this.tb.modules.securityQuestions.inputShareFromSecurityQuestions(
        password,
        'what is your password?'
      )
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  async torusChangePasswordShare (password) {
    try {
      await this.tb.modules.securityQuestions.changeSecurityQuestionAndAnswer(
        password,
        'what is your password?'
      )
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  async torusAddPasswordShare (password) {
    // add new share
    try {
      await this.tb.modules.securityQuestions.generateNewShareWithSecurityQuestions(
        password,
        'what is your password?'
      )
      // reconstruct and check if any issues
      await this.reconstructTorusKeyrings()
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  async setSettingsPageData () {
    const tkey = this.tb
    const onDeviceShare = {}
    const passwordShare = {}

    const keyDetails = this.tb.getKeyDetails()
    const shareDesc = Object.assign({}, keyDetails.shareDescriptions)
    Object.keys(shareDesc).map((el) => {
      shareDesc[el] = shareDesc[el].map((jl) => {
        return JSON.parse(jl)
      })
    })
    this.store.updateState({
      parsedShareDesc: shareDesc,
      keyDetails: keyDetails,
    })
    const parsedShareDesc = shareDesc

    // Total device shares
    const allDeviceShares = this.getTotalDeviceShares()

    // For ondevice share
    try {
      const el = await tkey.modules.chromeExtensionStorage.getStoreFromChromeExtensionStorage()
      console.log('For ondevice share', tkey.modules)
      console.log('For ondevice share', el)
      if (el) {
        onDeviceShare.available = true
        onDeviceShare.share = el
      }
    } catch {
      onDeviceShare.available = false
    }

    // password share
    const passwordModules = Object.values(parsedShareDesc)
      .flatMap((x) => x)
      .filter((el) => el.module === 'securityQuestions')
    passwordShare.available = passwordModules.length > 0

    // Current threshold
    const threshold = keyDetails.threshold + '/' + keyDetails.totalShares

    const { postBox } = this.store.getState()
    this.store.updateState({
      settingsPageData: {
        serviceProvider: {
          available: tkey.serviceProvider.postboxKey !== '0',
          verifierId: postBox.userInfo.email,
        },
        deviceShare: onDeviceShare,
        allDeviceShares: allDeviceShares,
        passwordShare: passwordShare,
        tkey: tkey,
        threshold: threshold,
      },
    })
  }

  async getTkeyDataForSettingsPage () {
    await this.setSettingsPageData()
    const el = this.store.getState().settingsPageData
    return el
  }

  getTotalDeviceShares () {
    // Avoid modifying this.tb
    const { parsedShareDesc } = this.store.getState()
    const shareDesc = Object.assign({}, parsedShareDesc)
    Object.keys(shareDesc).map((el) => {
      shareDesc[el] = shareDesc[el].filter(
        (el) =>
          el.module === 'chromeExtensionStorage' || el.module === 'webStorage'
      )
    })
    return shareDesc
  }

  async copyShareUsingIndexAndStoreLocally (index) {
    const outputshare = this.tb.outputShare(index)
    this.tb.modules.chromeExtensionStorage.storeDeviceShare(outputshare)
    this.store.updateState({ keyDetails: this.tb.getKeyDetails() })
    await this.setSettingsPageData()
    // store locally
  }

  async generateAndStoreNewDeviceShare () {
    try {
      const newShare = await this.tb.generateNewShare()
      this.tb.modules.chromeExtensionStorage.storeDeviceShare(
        newShare.newShareStores[newShare.newShareIndex.toString('hex')]
      )
      this.store.updateState({ keyDetails: this.tb.getKeyDetails() })
      await this.setSettingsPageData()
    } catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }

  async deleteShareDescription (shareIndex, desc) {
    try {
      await this.tb.deleteShareDescription(shareIndex, desc, true)
      this.store.updateState({ keyDetails: this.tb.getKeyDetails() })
      await this.setSettingsPageData()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async requestShareFromOtherDevice () {
    try {
      console.log('requesting new share')
      const indexes = this.tb.getCurrentShareIndexes()
      const encPubKeyX = await this.tb.modules.shareTransfer.requestNewShare(window.navigator.userAgent, indexes)
      console.log(encPubKeyX)
      return encPubKeyX
    } catch (err) {
      // console.error(err)
      return Promise.reject(err)
    }
  }

  // waiting for approval
  async startRequestStatusCheck (encKey) {
    try {
      console.log('waiting for request to be approved')
      const share = await this.tb.modules.shareTransfer.startRequestStatusCheck(encKey)
      await this.tb.modules.shareTransfer.deleteShareTransferStore(encKey) // delete old share requests
      console.log(share, this.tb)
      await this.reconstructTorusKeyrings()
      // let reconstructedKey = await this.tb.reconstructKey();
      // return reconstructedKey
    } catch (err) {
      console.log('request check interval failed', err)
      return Promise.reject(err)
    }
  }

  // check if any requests for approval
  async lookForRequests () {
    return new Promise((resolve) => {
      clearInterval(this.requestStatusCheckId)
      this.requestStatusCheckId = setInterval(async () => {
        try {
          // console.log('looking for requests')
          const latestShareTransferStore = await this.tb.modules.shareTransfer.getShareTransferStore()
          const encKeys = Object.keys(latestShareTransferStore)
          // console.log(latestShareTransferStore)
          if (encKeys.length > 0) {
            // Multiple share transfer requests could exist at any point in time. We do serialized resolution of requests.
            this.currentEncKey = encKeys[0]
            // To check if other devices have already approved the share request
            if (!latestShareTransferStore[this.currentEncKey].encShareInTransit) {
              resolve(latestShareTransferStore[this.currentEncKey])
            }
          }
        } catch (err) {
          console.error(err)
        }
      }, 1000)
    })
  }

  // Approve request with share
  async approveShareRequest (pubkey) {
    console.log('approveShareRequest -> pubkey', pubkey)
    try {
      await this.tb.modules.shareTransfer.approveRequest(this.currentEncKey)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async cancelShareRequest () {
    try {
      await this.tb.modules.shareTransfer.deleteShareTransferStore(this.currentEncKey)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  // String
  async addSeedPhrase (seedPhrase) {
    try {
      await this.tb.modules.seedPhraseModule.setSeedPhrase(seedPhrase, 'HD Key Tree')
      await this.reconstructTorusKeyrings()
    } catch (err) {
      console.log('adding seed phrase failed', err)
      return err
    }
  }

  // Array of BNs
  async addPrivateKeys (keys) {
    try {
      const currentkeys = await this.tb.modules.privateKeyModule.getAccounts()
      const bnKeys = keys.map((el) => new BN(el, 'hex'))
      await this.tb.modules.privateKeyModule.setPrivateKeys(currentkeys.concat(bnKeys), 'secp256k1n')
      await this.reconstructTorusKeyrings()
    } catch (err) {
      console.log('adding private keys failed', err)
      return err
    }
  }

  async getPostBox () {
    const { postBox } = this.store.getState()
    return postBox
  }
}
