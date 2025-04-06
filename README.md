**AIRAWARE MOBILE APP**

**Installation**

1. Install Expo CLI & EAS CLI (If not installed)
   `npm install -g expo-cli eas-cli`

3. Clone this repository
   `git clone https://github.com/ence03/AirAware-Mobile.git`
   `cd mobile`

4. Install dependencies
   `npm install`

5. Start development server
   `npm start`
   // Use expo go app and scan the qr code to open mobile app on you device

**Building APK using EAS**

1. Login to EAS (only required once)
  `eas login`

2. Configure EAS for the project:
   `eas build:configure`

3. Build APK:
   `eas build --platform android`

4. Download the APK:
   After the build completes, Expo will provide a download link for the APK.
