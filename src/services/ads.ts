
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';


let testMode = false;
export async function initializeAdmob(testAds: boolean): Promise<void> {
    const { status } = await AdMob.trackingAuthorizationStatus();

    testMode = testAds;
    if (status === 'notDetermined') {
        /**
         * If you want to explain TrackingAuthorization before showing the iOS dialog,
         * you can show the modal here.
         * ex)
         * const modal = await this.modalCtrl.create({
         *   component: RequestTrackingPage,
         * });
         * await modal.present();
         * await modal.onDidDismiss();  // Wait for close modal
         **/
    }

    AdMob.initialize({
        // testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
        initializeForTesting: true,
    }).then(res => {
        loadBannerAd();
    });
}

export async function loadBannerAd(): Promise<void> {
    console.log('banner');
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        // Subscribe Banner Event Listener
        document.body.style.height = "92.5vh";
    });
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
        // Subscribe Banner Event Listener
        document.body.style.height = "100vh";
    });
    AdMob.addListener(BannerAdPluginEvents.Closed, () => {
        // Subscribe Banner Event Listener
        document.body.style.height = "100vh";
    });

    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
        // Subscribe Change Banner Size
    });

    let TestBannerId = 'ca-app-pub-3940256099942544/6300978111';
    let LiveBannerId = 'ca-app-pub-9047963750627639/8230740665';

    const options: BannerAdOptions = {

        // adId: 'ca-app-pub-3940256099942544/6300978111', // test ad
        adId: LiveBannerId, // real ad
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
        // npa: true
    };
    console.log(testMode)
    if (testMode) {
        options.isTesting = true;
        options.adId = TestBannerId
    } else { }

    AdMob.showBanner(options);
}