# UKTrainWidget

A Scriptable iOS widget that displays **real-time train departure information in the UK**, powered by [TransportAPI](https://www.transportapi.com/).  
This is a redesigned and enhanced version of the original [scriptable-transit]([https://github.com/trevorhealy/uk-train-widget](https://github.com/trevorwhealy/scriptable-transit) by Trevor Healy.

## 🚀 Features

- ✅ Real-time train data using [TransportAPI](https://www.transportapi.com/)
- 🔁 Automatically switches between **two API keys** at **12:00 noon daily**, allowing free tier usage without interruptions
- 🧭 Supports **two configurable station pairs**, each with direction and station codes
- 📍 Displays **next 3 trains** for **both directions**
- 🛤️ Shows **platform information** (if available)
- 🎛️ Easy customisation via config section in the script
- 📱 Designed to work as a Scriptable **small-sized widget**

---

## 📷 Screenshot

![IMG_7209](https://github.com/user-attachments/assets/7bd01a0c-a1ac-4d69-8525-06f3e2733195)



---

## 🔧 Setup Instructions

1. **Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188)** from the App Store
2. **Register at [TransportAPI](https://www.transportapi.com/)**
   - You will need to create two free accounts and generate **two API keys**
   - Each free key has a limited daily quota; this widget will switch keys automatically at noon (12:00 PM local time)
3. **Copy the script into Scriptable**
4. **Edit the configuration section** at the top of the script:
   ```javascript
   const config = {
     apiKeys: [
       { app_id: 'your_app_id_1', app_key: 'your_app_key_1' },
       { app_id: 'your_app_id_2', app_key: 'your_app_key_2' }
     ],
     stationPairs: [
       { from: 'WAT', to: 'CLJ', direction: 'Inbound' },
       { from: 'CLJ', to: 'WAT', direction: 'Outbound' }
     ]
   };

## 🔧 Setup
1. Install [Scriptable](https://scriptable.app) from the App Store
2. Copy the script from `uktrainroutine.js` into a new Scriptable script
3. Set your station code and preferences in the config section
4. Add a Scriptable widget on your Home Screen and select this script

## 🙏 Credits
Originally inspired by[scriptable-transit]([https://github.com/trevorhealy/uk-train-widget](https://github.com/trevorwhealy/scriptable-transit) by Trevor Healy, licensed under the MIT License.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
